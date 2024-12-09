import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import { Comment, type CommentProps } from "./comment";

export interface AnswerCommentProps extends CommentProps {
	answerId: UniqueEntityId;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
	get answerId() {
		return this.props.answerId;
	}

	static create(
		props: Optional<AnswerCommentProps, "createdAt">,
		id?: UniqueEntityId,
	) {
		const answerComment = new AnswerComment(
			{ ...props, createdAt: props?.createdAt ?? new Date() },
			id,
		);

		return answerComment;
	}
}
