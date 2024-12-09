import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	AnswerAttachment,
	type AnswerAttachmentProps,
} from "@/domain/forum/enterprise/entities/answer-attachment";

export const makeAnswerAttachment = (
	override: Partial<AnswerAttachmentProps> = {},
	id?: UniqueEntityId,
) => {
	const answerAttachment = AnswerAttachment.create(
		{
			answerId: new UniqueEntityId(),
			attachmentId: new UniqueEntityId(),
			...override,
		},
		id,
	);

	return answerAttachment;
};
