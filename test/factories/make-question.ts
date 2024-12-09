import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	Question,
	type QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { faker } from "@faker-js/faker"

export const makeQuestion = (override: Partial<QuestionProps> = {}, id?: UniqueEntityId) => {
	const newQuestion = Question.create({
		authorId: new UniqueEntityId("1"),
		title: faker.lorem.sentence(),
		slug: Slug.create("new-question"),
		content: faker.lorem.text(),
		...override,
	}, id);

	return newQuestion;
};
