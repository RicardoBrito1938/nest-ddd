import { type Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";

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

@Injectable()
export class FetchAnswerCommentsUseCase {
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
