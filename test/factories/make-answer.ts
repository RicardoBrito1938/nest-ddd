import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { PrismaAnswerMapper } from "@/infra/database/prisma/mappers/prisma-answer-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

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

@Injectable()
export class AnswerFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
		const answer = makeAnswer(data);

		await this.prisma.answer.create({
			data: PrismaAnswerMapper.toPersistence(answer),
		});

		return answer;
	}
}
