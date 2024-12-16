import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

type AuthenticateBodySchemaType = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
	constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() body: AuthenticateBodySchemaType) {
		const { password, email } = body;

		const result = await this.authenticateStudent.execute({
			email,
			password,
		});

		if (result.isLeft()) {
			throw new Error();
		}

		const { accessToken } = result.value;

		return {
			access_token: accessToken,
		};
	}
}
