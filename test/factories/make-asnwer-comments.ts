import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	AnswerComment,
	type AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comment";
import { faker } from "@faker-js/faker";

export const makeAnswerComment = (
	override: Partial<AnswerCommentProps> = {},
	id?: UniqueEntityId,
) => {
	const answerComment = AnswerComment.create(
		{
			authorId: new UniqueEntityId(),
			answerId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return answerComment;
};
