import type { Question } from "@/domain/forum/enterprise/entities/question";
import type { QuestionsRepository } from "../repositories/questions-repository";
import type { AnswersRepository } from "../repositories/answers-repository";
import type { Answer } from "../../enterprise/entities/answer";
import { type Either, right } from "@/core/either";

interface FetchQuestionAnswersCaseRequest {
	questionId: string;
	page: number;
}

type FetchQuestionAnswersCaseResponse = Either<
	null,
	{
		answers: Answer[];
	}
>;

export class FetchQuestionAnswersCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		questionId,
		page,
	}: FetchQuestionAnswersCaseRequest): Promise<FetchQuestionAnswersCaseResponse> {
		const answers = await this.answersRepository.findManyByQuestionId(
			questionId,
			{
				page,
			},
		);

		return right({ answers });
	}
}
