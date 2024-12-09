import type { Question } from "@/domain/forum/enterprise/entities/question";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { right, type Either } from "@/core/either";

interface FetchRecentQuestionsCaseRequest {
	page: number;
}

type FetchRecentQuestionsCaseResponse = Either<
	null,
	{
		questions: Question[];
	}
>;

export class FetchRecentQuestionsCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		page,
	}: FetchRecentQuestionsCaseRequest): Promise<FetchRecentQuestionsCaseResponse> {
		const questions = await this.questionsRepository.findManyRecent({
			page,
		});

		return right({ questions });
	}
}
