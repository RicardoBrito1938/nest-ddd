import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachments";
import { StudentFactory } from "test/factories/make-student";

describe("Edit question (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let attachmentFactory: AttachmentFactory;
	let questionAttachmentFactory: QuestionAttachmentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				AttachmentFactory,
				QuestionAttachmentFactory,
			],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[PUT] /questions/:id", async () => {
		const user = await studentFactory.makePrismaStudent();
		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const questionId = question.id.toString();

		const attachment1 = await attachmentFactory.makePrismaAttachment();
		const attachment2 = await attachmentFactory.makePrismaAttachment();

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			questionId: question.id,
			attachmentId: attachment1.id,
		});

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			questionId: question.id,
			attachmentId: attachment2.id,
		});

		const attachment3 = await attachmentFactory.makePrismaAttachment();

		const response = await request(app.getHttpServer())
			.put(`/questions/${questionId}`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				title: "New title",
				content: "New content",
				attachmentIds: [attachment1.id.toString(), attachment3.id.toString()],
			});

		expect(response.statusCode).toBe(204);
		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title: "New title",
				content: "New content",
			},
		});
		expect(questionOnDatabase).toBeTruthy();

		const attachmentsOnDatabase = await prisma.attachment.findMany({
			where: {
				questionId: question.id.toString(),
			},
		});

		console.log({ attachmentsOnDatabase });
	});
});
