import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { TokenPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Post,
} from "@nestjs/common";
import { z } from "zod";

const commentOnAnswerBodySchema = z.object({
	content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema);

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;
@Controller("/answers/:answerId/comments")
export class CommentOnAnswerController {
	constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

	@Post()
	async handle(
		@Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
		@CurrentUser() user: TokenPayload,
		@Param("answerId") answerId: string,
	) {
		const { content } = body;
		const userId = user.sub;

		const result = await this.commentOnAnswer.execute({
			content,
			answerId,
			authorId: userId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
