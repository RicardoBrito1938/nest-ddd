import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { TokenPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import {
	BadRequestException,
	Body,
	Controller,
	Param,
	Post,
} from "@nestjs/common";
import { z } from "zod";

const answerQuestionBodySchema = z.object({
	content: z.string(),
});

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

@Controller("/questions/:questionId/answers")
export class AnswerQuestionController {
	constructor(private answerQuestion: AnswerQuestionUseCase) {}

	@Post()
	async handle(
		@CurrentUser() user: TokenPayload,
		@Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
		@Param("questionId") questionId: string,
	) {
		const { content } = body;
		const { sub: userId } = user;

		const result = await this.answerQuestion.execute({
			attachmentIds: [],
			content,
			authorId: userId,
			questionId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
