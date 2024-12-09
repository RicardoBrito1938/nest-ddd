import request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/prisma/prisma.service";

describe("Create account (E2E)", () => {
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

	test("[POST] /accounts", async () => {
		await request(app.getHttpServer())
			.post("/accounts")
			.send({
				name: "John doe",
				email: "johndoe@mail.com",
				password: "password",
			})
			.expect(201);

		const userOnDataBase = await prisma.user.findUnique({
			where: {
				email: "johndoe@mail.com",
			},
		});

		expect(userOnDataBase).toBeDefined();
	});
});
