import { CreateStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";

const createAccountBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(6),
});

type CreateAccountBodySchemaType = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
	constructor(private createStudentUseCase: CreateStudentUseCase) {}

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
			throw new Error();
		}
	}
}
