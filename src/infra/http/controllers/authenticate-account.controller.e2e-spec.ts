import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcrypt";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";

describe("Authenticate (E2E)", () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);

		await app.init();
	});

	test("[POST] /sessions", async () => {
		await studentFactory.makePrismaStudent({
			email: "johndoe@mail.com",
			password: await hash("password", 8),
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
