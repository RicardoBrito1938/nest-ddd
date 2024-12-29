import { ValueObject } from "@/core/entities/value-object";

export interface CommentWithAuthorProps {
	commentId: string;
	content: string;
	author: string;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
	getCommentId() {
		return this.props.commentId;
	}

	getContent() {
		return this.props.content;
	}

	getAuthor() {
		return this.props.author;
	}

	getCreatedAt() {
		return this.props.createdAt;
	}

	getUpdatedAt() {
		return this.props.updatedAt;
	}
	static create(props: CommentWithAuthorProps): CommentWithAuthor {
		return new CommentWithAuthor(props);
	}
}
