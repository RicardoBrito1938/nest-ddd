import { DomainEvents } from "@/core/events/domain-events";
import type { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = [];

	constructor(
		private questionAttachmentsRepository: QuestionAttachmentsRepository,
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
