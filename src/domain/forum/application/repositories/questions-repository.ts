import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { Question } from "@/domain/forum/enterprise/entities/question";

export abstract class QuestionsRepository {
	abstract findById(questionId: string): Promise<Question | null>;
	abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
	abstract create(question: Question): Promise<void>;
	abstract getBySlug(slug: string): Promise<Question | null>;
	abstract delete(question: Question): Promise<void>;
	abstract update(question: Question): Promise<void>;
}
