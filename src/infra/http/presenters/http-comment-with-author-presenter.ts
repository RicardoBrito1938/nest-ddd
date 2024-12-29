import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class HttpCommentWithAuthorPresenter {
	static toHTTP(commentWithAUthor: CommentWithAuthor) {
		return {
			commentId: commentWithAUthor.commentId.toString(),
			authorId: commentWithAUthor.authorId.toString(),
			authorName: commentWithAUthor.author,
			content: commentWithAUthor.content,
			createdAt: commentWithAUthor.createdAt,
			updatedAt: commentWithAUthor.updatedAt,
		};
	}
}
