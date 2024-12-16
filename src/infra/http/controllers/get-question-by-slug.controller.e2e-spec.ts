import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { hash } from "bcrypt";
import request from "supertest";

describe("Get question by slug (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		await app.init();
	});

	test("[GET] /questions/:slug", async () => {
		const newUser = {
			name: "John doe",
			email: "johndoe@mail.com",
			password: await hash("password", 8),
		};

		const user = await prisma.user.create({
			data: newUser,
		});

		const token = jwt.sign({ sub: user.id });

		const question = {
			title: "What is the best way to learn programming?",
			content: "I want to learn programming, but I don't know where to start.",
			authorId: user.id,
			slug: "what-is-the-best-way-to-learn-programming",
		};

		await prisma.question.create({
			data: question,
		});

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.slug}`)
			.set("Authorization", `Bearer ${token}`)
			.send()
			.expect(200);

		expect(response.body).toEqual({
			question: expect.objectContaining({ title: question.title }),
		});
	});
});
