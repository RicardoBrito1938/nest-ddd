import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionDetails } from "../../enterprise/entities/value-objects/question-details";

export abstract class QuestionsRepository {
	abstract findById(questionId: string): Promise<Question | null>;
	abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
	abstract create(question: Question): Promise<void>;
	abstract getBySlug(slug: string): Promise<Question | null>;
	abstract getBySlugWithDetails(slug: string): Promise<QuestionDetails | null>;
	abstract delete(question: Question): Promise<void>;
	abstract update(question: Question): Promise<void>;
}
