import type { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import type { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	constructor(private studentsRepository: InMemoryStudentsRepository) {}

	public items: QuestionComment[] = [];

	async create(questionComment: QuestionComment): Promise<void> {
		this.items.push(questionComment);
		return Promise.resolve();
	}

	async findById(id: string): Promise<QuestionComment | null> {
		const questionComment = this.items.find(
			(questionComment) => questionComment.id.toString() === id,
		);

		return Promise.resolve(questionComment || null);
	}

	async findManyByQuestionId(
		questionId: string,
		params: { page: number },
	): Promise<QuestionComment[]> {
		const questionComments = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((params.page - 1) * 20, params.page * 20);
		return Promise.resolve(questionComments);
	}

	async findManyByQuestionIdWithAuthor(
		questionId: string,
		params: { page: number },
	): Promise<CommentWithAuthor[]> {
		const questionComments = this.items
			.filter((item) => item.questionId.toString() === questionId)
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

		return Promise.resolve(questionComments);
	}

	async delete(questionComment: QuestionComment): Promise<void> {
		this.items = this.items.filter((item) => item.id !== questionComment.id);
		return Promise.resolve();
	}
}
