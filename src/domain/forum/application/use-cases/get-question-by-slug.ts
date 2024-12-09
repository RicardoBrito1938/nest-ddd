import type { Question } from "@/domain/forum/enterprise/entities/question";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { right, type Either } from "@/core/either";

interface GetQuestionBySlugUseCaseRequest {
	slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
	null,
	{
		question: Question;
	}
>;

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
