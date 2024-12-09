import request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { hash } from "bcrypt";
import { AppModule } from "@/infra/app.module";

describe("Authenticate (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get<PrismaService>(PrismaService);

		await app.init();
	});

	test("[POST] /sessions", async () => {
		const newUser = {
			name: "John doe",
			email: "johndoe@mail.com",
			password: await hash("password", 8),
		};

		await prisma.user.create({
			data: newUser,
		});

		await request(app.getHttpServer())
			.post("/sessions")
			.send({
				email: "johndoe@mail.com",
				password: "password",
			})
			.expect(201)
			.expect((response) => {
				expect(response.body).toEqual({
					access_token: expect.any(String),
				});
			});
	});
});
