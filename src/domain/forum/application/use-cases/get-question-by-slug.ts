import { type Either, right } from "@/core/either";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { QuestionsRepository } from "../repositories/questions-repository";

interface GetQuestionBySlugUseCaseRequest {
	slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
	null,
	{
		question: Question;
	}
>;

@Injectable()
export class GetQuestionBySlugUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		slug,
	}: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
		const question = await this.questionsRepository.getBySlug(slug);

		if (!question) {
			throw new Error("Question not found");
		}

		return right({
			question,
		});
	}
}
