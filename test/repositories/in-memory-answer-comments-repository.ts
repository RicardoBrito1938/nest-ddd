import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository
	implements AnswerCommentsRepository
{
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
}
