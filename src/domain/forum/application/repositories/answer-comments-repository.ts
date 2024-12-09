import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerComment } from "../../enterprise/entities/answer-comment";

export interface AnswerCommentsRepository {
	create(answerComment: AnswerComment): Promise<void>;
	findById(id: string): Promise<AnswerComment | null>;
	delete(answerComment: AnswerComment): Promise<void>;
	findManyByAnswerId(
		answerId: string,
		params: PaginationParams,
	): Promise<AnswerComment[]>;
}
