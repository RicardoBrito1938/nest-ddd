import request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";

describe("Fetch recent questions (E2E)", () => {
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

	test("[GET] /questions", async () => {
		const newUser = {
			name: "John doe",
			email: "johndoe@mail.com",
			password: await hash("password", 8),
		};

		const user = await prisma.user.create({
			data: newUser,
		});

		const token = jwt.sign({ sub: user.id });

		const questionsList = [
			{
				title: "What is the best way to learn programming?",
				content:
					"I want to learn programming, but I don't know where to start.",
				authorId: user.id,
				slug: "what-is-the-best-way-to-learn-programming",
			},
			{
				title: "How to create a REST API?",
				content: "I want to create a REST API, but I don't know how to start.",
				authorId: user.id,
				slug: "how-to-create-a-rest-api",
			},
		];

		await prisma.question.createMany({
			data: questionsList,
		});

		const response = await request(app.getHttpServer())
			.get("/questions")
			.set("Authorization", `Bearer ${token}`)
			.send()
			.expect(200);

		expect(response.body).toEqual({
			questions: expect.arrayContaining([
				expect.objectContaining({
					title: questionsList[0].title,
				}),
				expect.objectContaining({
					title: questionsList[1].title,
				}),
			]),
		});
	});
});
