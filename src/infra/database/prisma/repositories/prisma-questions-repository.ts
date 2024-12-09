import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	findById(questionId: string): Promise<Question | null> {
		throw new Error("Method not implemented.");
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
