import { left, right, type Either } from "@/core/either";
import type { Question } from "../../enterprise/entities/question";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import type { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface EditQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	title: string;
	content: string;
	attachmentIds: string[];
}

type EditQuestionUseCaseResponse = Either<
	NotAllowedError | ResourceNotFoundError,
	{
		question: Question;
	}
>;

export class EditQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionAttachmentsRepository: QuestionAttachmentsRepository,
	) {}

	async execute({
		authorId,
		questionId,
		title,
		content,
		attachmentIds,
	}: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		if (authorId !== question.authorId.toString()) {
			return left(new NotAllowedError());
		}

		const attachments =
			await this.questionAttachmentsRepository.findManyByQuestionId(questionId);
		const questionAttachmentList = new QuestionAttachmentList(attachments);

		const questionAttachments = attachmentIds.map((attachmentId) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				questionId: question.id,
			});
		});

		questionAttachmentList.update(questionAttachments);

		question.attachments = questionAttachmentList;
		question.title = title;
		question.content = content;

		await this.questionsRepository.update(question);

		return right({
			question,
		});
	}
}
