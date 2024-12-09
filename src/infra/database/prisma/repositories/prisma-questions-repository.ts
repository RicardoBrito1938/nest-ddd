import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	constructor(private prisma: PrismaService) {}

	async findById(questionId: string): Promise<Question | null> {
		const question = await this.prisma.question.findUnique({
			where: {
				id: questionId,
			},
		});

		if (!question) {
			return null;
		}

		return PrismaQuestionMapper.toDomain(question);
	}
	findManyRecent(params: PaginationParams): Promise<Question[]> {
		throw new Error("Method not implemented.");
	}
	create(question: Question): Promise<void> {
		throw new Error("Method not implemented.");
	}
	getBySlug(slug: string): Promise<Question | null> {
		throw new Error("Method not implemented.");
	}
	delete(question: Question): Promise<void> {
		throw new Error("Method not implemented.");
	}
	update(question: Question): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
