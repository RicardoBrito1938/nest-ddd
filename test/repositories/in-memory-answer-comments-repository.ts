import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	constructor(private studentsRepository: InMemoryStudentsRepository) {}

	public items: AnswerComment[] = [];

	async create(answerComment: AnswerComment): Promise<void> {
		this.items.push(answerComment);
		return Promise.resolve();
	}

	async findById(id: string): Promise<AnswerComment | null> {
		const answerComment = this.items.find((item) => item.id.toString() === id);
		return Promise.resolve(answerComment || null);
	}

	async delete(answerComment: AnswerComment): Promise<void> {
		this.items = this.items.filter((item) => item.id !== answerComment.id);
		return Promise.resolve();
	}

	async findManyByAnswerId(
		answerId: string,
		params: PaginationParams,
	): Promise<AnswerComment[]> {
		const answerComments = this.items
			.filter((item) => item.answerId.toString() === answerId)
			.slice((params.page - 1) * 20, params.page * 20);
		return Promise.resolve(answerComments);
	}

	async findManyByAnswerIdWithAuthor(
		answerId: string,
		params: { page: number },
	): Promise<CommentWithAuthor[]> {
		const answerComments = this.items
			.filter((item) => item.answerId.toString() === answerId)
			.slice((params.page - 1) * 20, params.page * 20)
			.map((comment) => {
				const author = this.studentsRepository.items.find((student) =>
					student.id.equals(comment.authorId),
				);

				if (!author) {
					throw new Error("Author not found");
				}

				return CommentWithAuthor.create({
					content: comment.content,
					commentId: comment.id,
					createdAt: comment.createdAt,
					updatedAt: comment.updatedAt,
					authorId: comment.authorId,
					author: author.name,
				});
			});

		return Promise.resolve(answerComments);
	}
}
