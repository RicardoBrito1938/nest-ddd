import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchRecentQuestionsCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { HttpQuestionPresenter } from "../presenters/http-question-presenter";

const pageQueryParamSchema = z
	.string()
	.optional()
	.default("1")
	.transform(Number)
	.pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
	constructor(private fetchRecentQuestions: FetchRecentQuestionsCase) {}

	@Get()
	async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
		const result = await this.fetchRecentQuestions.execute({
			page,
		});

		if (result.isLeft()) {
			throw new Error("Failed to fetch recent questions");
		}

		return {
			questions: result.value.questions.map(HttpQuestionPresenter.toHTTP),
		};
	}
}
