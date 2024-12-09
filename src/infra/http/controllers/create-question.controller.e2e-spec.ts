import request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";

describe("Create question (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get<PrismaService>(PrismaService);
		jwt = moduleRef.get<JwtService>(JwtService);

		await app.init();
	});

	test("[POST] /questions", async () => {
		const newUser = {
			name: "John doe",
			email: "johndoe@mail.com",
			password: await hash("password", 8),
		};

		const user = await prisma.user.create({
			data: newUser,
		});

		const token = jwt.sign({ sub: user.id });

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
