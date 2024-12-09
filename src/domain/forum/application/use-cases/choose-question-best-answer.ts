import type { Question } from "@/domain/forum/enterprise/entities/question";
import type { QuestionsRepository } from "../repositories/questions-repository";
import type { AnswersRepository } from "../repositories/answers-repository";
import { left, right, type Either } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";

interface ChooseQuestionBestAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;

export class ChooseQuestionBestAnswerUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private answersRepository: AnswersRepository,
	) {}

	async execute({
		authorId,
		answerId,
	}: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		const question = await this.questionsRepository.findById(
			answer.questionId.toString(),
		);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		if (authorId !== question.authorId.toString()) {
			return left(new NotAllowedError());
		}

		question.bestAnswerId = answer.id;

		await this.questionsRepository.update(question);

		return right({
			question,
		});
	}
}
