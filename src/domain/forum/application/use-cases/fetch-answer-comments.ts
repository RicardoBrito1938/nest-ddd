import { right, type Either } from "@/core/either";
import type { AnswerComment } from "../../enterprise/entities/answer-comment";
import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository";

interface FetchAnswerCommentsCaseRequest {
	answerId: string;
	page: number;
}

type FetchAnswerCommentsCaseResponse = Either<
	null,
	{
		answerComment: AnswerComment[];
	}
>;

export class FetchAnswerCommentsCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({
		answerId,
		page,
	}: FetchAnswerCommentsCaseRequest): Promise<FetchAnswerCommentsCaseResponse> {
		const answerComment =
			await this.answerCommentsRepository.findManyByAnswerId(answerId, {
				page,
			});

		return right({ answerComment });
	}
}
