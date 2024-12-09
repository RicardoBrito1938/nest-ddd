import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import { AnswerAttachmentList } from "./answer-attachment-list";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { AnswerCreatedEvent } from "../events/answer-created-event";

export interface AnswerProps {
	questionId: UniqueEntityId;
	authorId: UniqueEntityId;
	attachments: AnswerAttachmentList;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
}

export class Answer extends AggregateRoot<AnswerProps> {
	get content(): string {
		return this.props.content;
	}

	get questionId(): UniqueEntityId {
		return this.props.questionId;
	}

	get authorId(): UniqueEntityId {
		return this.props.authorId;
	}

	get attachments(): AnswerAttachmentList {
		return this.props.attachments;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date | undefined {
		return this.props.updatedAt;
	}

	get excerpt(): string {
		return this.props.content.substring(0, 100).trimEnd().concat("...");
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	set attachments(attachments: AnswerAttachmentList) {
		this.props.attachments = attachments;
		this.touch();
	}

	static create(
		props: Optional<AnswerProps, "createdAt" | "attachments">,
		id?: UniqueEntityId,
	) {
		const answer = new Answer(
			{
				...props,
				createdAt: props?.createdAt ?? new Date(),
				attachments: props?.attachments ?? new AnswerAttachmentList(),
			},
			id,
		);

		const isNewAnswer = !id;

		if (isNewAnswer) {
			answer.addDomainEvent(new AnswerCreatedEvent(answer));
		}

		return answer;
	}
}
