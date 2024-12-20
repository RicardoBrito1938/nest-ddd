import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Upload attachment (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[POST] /attachments", async () => {
		const user = await studentFactory.makePrismaStudent();
		const accessToken = jwt.sign({ sub: user.id.toString() });

		const response = await request(app.getHttpServer())
			.post("/attachments")
			.set("Authorization", `Bearer ${accessToken}`)
			.attach("file", "test/e2e/chickens.jpeg");

		expect(response.statusCode).toBe(201);
	});
});
