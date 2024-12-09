import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	Answer,
	type AnswerProps,
} from "@/domain/forum/enterprise/entities/answer";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { faker } from "@faker-js/faker";

export const makeAnswer = (
	override: Partial<AnswerProps> = {},
	id?: UniqueEntityId,
) => {
	const newAnswer = Answer.create(
		{
			authorId: new UniqueEntityId(),
			questionId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return newAnswer;
};
