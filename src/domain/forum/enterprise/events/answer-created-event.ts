import type { DomainEvent } from "@/core/events/domain-event";
import type { Answer } from "../entities/answer";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class AnswerCreatedEvent implements DomainEvent {
	public occurredAt: Date;
	public answer: Answer;

	constructor(answer: Answer) {
		this.answer = answer;
		this.occurredAt = new Date();
	}

	getAggregateId(): UniqueEntityId {
		return this.answer.id;
	}
}
