import { DomainEvents } from "@/core/events/domain-events";
import type { EventHandler } from "@/core/events/event-handler";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import type { SendNotificationUseCase } from "../use-cases/send-notification";

export class OnAnswerCreated implements EventHandler {
	constructor(
		private questionsRepository: QuestionsRepository,
		private sendNotificationUseCase: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendNewAnswerNotification.bind(this),
			AnswerCreatedEvent.name,
		);
	}

	private async sendNewAnswerNotification({
		answer,
	}: AnswerCreatedEvent): Promise<void> {
		const question = await this.questionsRepository.findById(
			answer.questionId.toString(),
		);

		if (question) {
			await this.sendNotificationUseCase.execute({
				recipientId: question.authorId.toString(),
				title: `Your question has a new answer from ${answer.authorId}`,
				content: answer.excerpt,
			});
		}
	}
}
