import { left, right, type Either } from "./../../../../core/either";
import { Question } from "@/domain/forum/enterprise/entities/question";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import type { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";

interface CommentOnQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		questionComment: QuestionComment;
	}
>;

export class CommentOnQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionCommentsRepository: QuestionCommentsRepository,
	) {}

	async execute({
		authorId,
		questionId,
		content,
	}: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			left(new ResourceNotFoundError());
		}

		const questionComment = QuestionComment.create({
			authorId: new UniqueEntityId(authorId),
			content,
			questionId: new UniqueEntityId(questionId),
		});

		await this.questionCommentsRepository.create(questionComment);

		return right({
			questionComment,
		});
	}
}
