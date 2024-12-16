import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Prisma, Comment as PrismaComment } from "@prisma/client";

export class PrismaQuestionCommentMapper {
	static toDomain(raw: PrismaComment): QuestionComment {
		if (!raw.questionId) {
			throw new Error("QuestionComment does not have an questionId");
		}

		return QuestionComment.create(
			{
				content: raw.content,
				authorId: new UniqueEntityId(raw.authorId),
				questionId: new UniqueEntityId(raw.questionId),
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id),
		);
	}

	static toPersistence(
		questionComment: QuestionComment,
	): Prisma.CommentUncheckedCreateInput {
		return {
			id: questionComment.id.toString(),
			authorId: questionComment.authorId.toString(),
			content: questionComment.content,
			createdAt: questionComment.createdAt,
			updatedAt: questionComment.updatedAt,
			questionId: questionComment.questionId.toString(),
		};
	}
}
