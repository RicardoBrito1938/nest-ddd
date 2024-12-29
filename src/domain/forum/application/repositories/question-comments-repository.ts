import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { QuestionComment } from "../../enterprise/entities/question-comment";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

export abstract class QuestionCommentsRepository {
	abstract create(questionComment: QuestionComment): Promise<void>;
	abstract findById(id: string): Promise<QuestionComment | null>;
	abstract delete(questionComment: QuestionComment): Promise<void>;
	abstract findManyByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<QuestionComment[]>;
	abstract findManyByQuestionIdWithAuthor(
		questionId: string,
		params: PaginationParams,
	): Promise<CommentWithAuthor[]>;
}
