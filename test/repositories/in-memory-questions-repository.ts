import { DomainEvents } from "@/core/events/domain-events";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments-repository";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = [];

	constructor(
		private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
		private attachmentsRepository: InMemoryAttachmentsRepository,
		private studentsRepository: InMemoryStudentsRepository,
	) {}

	async create(question: Question): Promise<void> {
		this.items.push(question);

		await this.questionAttachmentsRepository.createMany(
			question.attachments.getItems(),
		);

		DomainEvents.dispatchEventsForAggregate(question.id);

		return Promise.resolve();
	}

	async getBySlug(slug: string): Promise<Question | null> {
		const question = this.items.find(
			(question) => question.slug.value === slug,
		);
		return Promise.resolve(question || null);
	}

	async getBySlugWithDetails(slug: string): Promise<QuestionDetails | null> {
		const question = this.items.find(
			(question) => question.slug.value === slug,
		);

		if (!question) {
			return null;
		}

		const author = await this.studentsRepository.items.find((student) =>
			student.id.equals(question.authorId),
		);

		if (!author) {
			throw new Error("Author not found");
		}

		const questionAttachments = this.questionAttachmentsRepository.items.filter(
			(questionAttachment) => questionAttachment.questionId.equals(question.id),
		);

		const attachments = questionAttachments.map((questionAttachment) => {
			const attachment = this.attachmentsRepository.items.find((attachment) =>
				attachment.id.equals(questionAttachment.attachmentId),
			);

			if (!attachment) {
				throw new Error("Attachment not found");
			}

			return attachment;
		});

		const questionWithDetails = QuestionDetails.create({
			questionId: question.id,
			authorId: question.authorId,
			author: author.name,
			title: question.title,
			slug: question.slug,
			content: question.content,
			bestAnswerId: question.bestAnswerId,
			attachments,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		});

		return Promise.resolve(questionWithDetails);
	}

	async delete(question: Question): Promise<void> {
		this.items = this.items.filter((item) => item.id !== question.id);

		this.questionAttachmentsRepository.deleteManyByQuestionId(
			question.id.toString(),
		);
		return Promise.resolve();
	}

	async findById(questionId: string): Promise<Question | null> {
		const question = this.items.find(
			(question) => question.id.toString() === questionId,
		);
		return Promise.resolve(question || null);
	}

	async findManyRecent({ page }: { page: number }): Promise<Question[]> {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);
		return Promise.resolve(questions);
	}

	async update(question: Question) {
		const itemIndex = this.items.findIndex((item) => item.id === question.id);

		await this.questionAttachmentsRepository.createMany(
			question.attachments.getNewItems(),
		);

		await this.questionAttachmentsRepository.deleteMany(
			question.attachments.getRemovedItems(),
		);

		this.items[itemIndex] = question;

		DomainEvents.dispatchEventsForAggregate(question.id);
	}
}
