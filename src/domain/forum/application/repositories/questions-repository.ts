import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { Question } from "@/domain/forum/enterprise/entities/question";

export interface QuestionsRepository {
	findById(questionId: string): Promise<Question | null>;
	findManyRecent(params: PaginationParams): Promise<Question[]>;
	create(question: Question): Promise<void>;
	getBySlug(slug: string): Promise<Question | null>;
	delete(question: Question): Promise<void>;
	update(question: Question): Promise<void>;
}
