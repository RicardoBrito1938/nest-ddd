import { Entity } from "@/core/entities/entity";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface AnswerAttachmentProps {
	answerId: UniqueEntityId;
	attachmentId: UniqueEntityId;
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
	get answerId() {
		return this.props.answerId;
	}

	get attachmentId() {
		return this.props.attachmentId;
	}

	static create(props: AnswerAttachmentProps, id?: UniqueEntityId) {
		return new AnswerAttachment(props, id);
	}
}
