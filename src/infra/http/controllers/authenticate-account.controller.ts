import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { StudentAlreadyExistsError } from "@/domain/forum/application/use-cases/errors/student-already-exists-error";
import { WrongCredentialsError } from "@/domain/forum/application/use-cases/errors/wrong-credentials-error";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
	UnauthorizedException,
	UsePipes,
} from "@nestjs/common";
import { z } from "zod";

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

type AuthenticateBodySchemaType = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
	constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

	private errorMap = {
		[WrongCredentialsError.name]: UnauthorizedException,
	};

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
			const error = result.value;
			const Exception =
				this.errorMap[error.constructor.name] || BadRequestException;
			throw new Exception(error.message);
		}

		const { accessToken } = result.value;

		return {
			access_token: accessToken,
		};
	}
}
