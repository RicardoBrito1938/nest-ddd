import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	constructor(private prisma: PrismaService) {}

	async findById(questionCommentId: string): Promise<QuestionComment | null> {
		const questionComment = await this.prisma.comment.findUnique({
			where: {
				id: questionCommentId,
			},
		});

		if (!questionComment) {
			return null;
		}

		return PrismaQuestionCommentMapper.toDomain(questionComment);
	}

	async findManyByQuestionId(questionId: string): Promise<QuestionComment[]> {
		const questionComments = await this.prisma.comment.findMany({
			where: {
				questionId,
			},
		});

		return questionComments.map(PrismaQuestionCommentMapper.toDomain);
	}

	async create(questionComment: QuestionComment): Promise<void> {
		const data = PrismaQuestionCommentMapper.toPersistence(questionComment);

		await this.prisma.comment.create({
			data,
		});
	}

	async delete(questionComment: QuestionComment): Promise<void> {
		await this.prisma.comment.delete({
			where: {
				id: questionComment.id.toString(),
			},
		});
	}

	async update(questionComment: QuestionComment): Promise<void> {
		const data = PrismaQuestionCommentMapper.toPersistence(questionComment);

		await this.prisma.comment.update({
			where: {
				id: questionComment.id.toString(),
			},
			data,
		});
	}
}
