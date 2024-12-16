import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Prisma, Comment as PrismaComment } from "@prisma/client";

export class PrismaAnswerCommentMapper {
	static toDomain(raw: PrismaComment): AnswerComment {
		if (!raw.answerId) {
			throw new Error("AnswerComment does not have an answerId");
		}

		return AnswerComment.create(
			{
				content: raw.content,
				authorId: new UniqueEntityId(raw.authorId),
				answerId: new UniqueEntityId(raw.answerId),
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id),
		);
	}

	static toPersistence(
		answerComment: AnswerComment,
	): Prisma.CommentUncheckedCreateInput {
		return {
			id: answerComment.id.toString(),
			authorId: answerComment.authorId.toString(),
			content: answerComment.content,
			createdAt: answerComment.createdAt,
			updatedAt: answerComment.updatedAt,
			answerId: answerComment.answerId.toString(),
		};
	}
}
