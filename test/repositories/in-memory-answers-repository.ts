import { DomainEvents } from "@/core/events/domain-events";
import type { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
	public items: Answer[] = [];

	constructor(
		private answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

	create(answer: Answer): Promise<void> {
		this.items.push(answer);

		DomainEvents.dispatchEventsForAggregate(answer.id);
		return Promise.resolve();
	}

	async delete(answer: Answer): Promise<void> {
		this.items = this.items.filter((item) => item.id !== answer.id);

		this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
		return Promise.resolve();
	}

	async findById(answerId: string): Promise<Answer | null> {
		const answer = this.items.find(
			(answer) => answer.id.toString() === answerId,
		);
		return Promise.resolve(answer || null);
	}

	async findManyByQuestionId(
		questionId: string,
		params: { page: number },
	): Promise<Answer[]> {
		const answers = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((params.page - 1) * 20, params.page * 20);
		return Promise.resolve(answers);
	}

	async update(answer: Answer) {
		const itemIndex = this.items.findIndex((item) => item.id === answer.id);
		this.items[itemIndex] = answer;
		DomainEvents.dispatchEventsForAggregate(answer.id);
	}
}
