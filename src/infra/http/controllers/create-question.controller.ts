import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { TokenPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
	attachmentsIds: z.array(z.string().uuid()),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller("/questions")
export class CreateQuestionController {
	constructor(private createQuestion: CreateQuestionUseCase) {}

	@Post()
	async handle(
		@CurrentUser() user: TokenPayload,
		@Body(bodyValidationPipe) body: CreateQuestionBodySchema,
	) {
		const { content, title, attachmentsIds } = body;
		const { sub: userId } = user;

		const result = await this.createQuestion.execute({
			authorId: userId,
			content,
			title,
			attachmentsIds,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
