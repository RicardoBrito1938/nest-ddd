import { type Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";

interface FetchQuestionCommentsCaseRequest {
	questionId: string;
	page: number;
}

type FetchQuestionCommentsCaseResponse = Either<
	null,
	{
		questionComment: QuestionComment[];
	}
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({
		questionId,
		page,
	}: FetchQuestionCommentsCaseRequest): Promise<FetchQuestionCommentsCaseResponse> {
		const questionComment =
			await this.questionCommentsRepository.findManyByQuestionId(questionId, {
				page,
			});

		return right({ questionComment });
	}
}
