import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";

describe("Create question (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get<PrismaService>(PrismaService);
		jwt = moduleRef.get<JwtService>(JwtService);
		studentFactory = moduleRef.get(StudentFactory);

		await app.init();
	});

	test("[POST] /questions", async () => {
		const user = await studentFactory.makePrismaStudent();
		const token = jwt.sign({ sub: user.id.toString() });

		const newQuestion = {
			title: "What is the best way to learn programming?",
			content: "I want to learn programming, but I don't know where to start.",
		};

		await request(app.getHttpServer())
			.post("/questions")
			.set("Authorization", `Bearer ${token}`)
			.send(newQuestion)
			.expect(201);

		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title: newQuestion.title,
			},
		});

		expect(questionOnDatabase).toBeDefined();
	});
});
