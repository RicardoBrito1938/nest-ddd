import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	Question,
	type QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { PrismaQuestionMapper } from "@/infra/database/prisma/mappers/prisma-question-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export const makeQuestion = (
	override: Partial<QuestionProps> = {},
	id?: UniqueEntityId,
) => {
	const newQuestion = Question.create(
		{
			authorId: new UniqueEntityId("1"),
			title: faker.lorem.sentence(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return newQuestion;
};

@Injectable()
export class QuestionFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaQuestion(
		data: Partial<QuestionProps> = {},
	): Promise<Question> {
		const question = makeQuestion(data);

		await this.prisma.question.create({
			data: PrismaQuestionMapper.toPersistence(question),
		});

		return question;
	}
}
