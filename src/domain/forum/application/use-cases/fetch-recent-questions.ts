import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { right, type Either } from "@/core/either";
import { Injectable } from "@nestjs/common";

interface FetchRecentQuestionsCaseRequest {
	page: number;
}

type FetchRecentQuestionsCaseResponse = Either<
	null,
	{
		questions: Question[];
	}
>;

@Injectable()
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
