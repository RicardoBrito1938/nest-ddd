import { StudentAlreadyExistsError } from "@/domain/forum/application/use-cases/errors/student-already-exists-error";
import { CreateStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	Post,
	UsePipes,
} from "@nestjs/common";
import { z } from "zod";

const createAccountBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(6),
});

type CreateAccountBodySchemaType = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
@Public()
export class CreateAccountController {
	constructor(private createStudentUseCase: CreateStudentUseCase) {}

	private errorMap = {
		[StudentAlreadyExistsError.name]: ConflictException,
	};

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createAccountBodySchema))
	async handle(@Body() body: CreateAccountBodySchemaType) {
		const { name, email, password } = body;

		const result = await this.createStudentUseCase.execute({
			name,
			email,
			password,
		});

		if (result.isLeft()) {
			const error = result.value;
			const Exception =
				this.errorMap[error.constructor.name] || BadRequestException;
			throw new Exception(error.message);
		}
	}
}
