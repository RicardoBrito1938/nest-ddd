import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
} from "@nestjs/common";
import { z } from "zod";
import { HttpCommentWithAuthorPresenter } from "../presenters/http-comment-with-author-presenter";

const pageQueryParamSchema = z
	.string()
	.optional()
	.default("1")
	.transform(Number)
	.pipe(z.number().min(1));
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/answers/:answerId/comments")
export class FetchAnswerCommentsController {
	constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}
	@Get()
	async handle(
		@Query("page", queryValidationPipe) page: PageQueryParamSchema,
		@Param("answerId") answerId: string,
	) {
		const result = await this.fetchAnswerComments.execute({
			page,
			answerId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const answerComments = result.value.comments;
		return {
			comments: answerComments.map(HttpCommentWithAuthorPresenter.toHTTP),
		};
	}
}
