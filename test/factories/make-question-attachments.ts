import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	QuestionAttachment,
	type QuestionAttachmentProps,
} from "@/domain/forum/enterprise/entities/question-attachment";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { faker } from "@faker-js/faker";

export const makeQuestionAttachment = (
	override: Partial<QuestionAttachmentProps> = {},
	id?: UniqueEntityId,
) => {
	const questionAttachment = QuestionAttachment.create(
		{
			questionId: new UniqueEntityId(),
			attachmentId: new UniqueEntityId(),
			...override,
		},
		id,
	);

	return questionAttachment;
};
