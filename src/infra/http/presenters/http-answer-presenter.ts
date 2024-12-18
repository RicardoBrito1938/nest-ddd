import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class HttpAnswerPresenter {
	static toHTTP(answer: Answer) {
		return {
			id: answer.id.toString(),
			content: answer.content,
			createdAt: answer.createdAt,
			updatedAt: answer.updatedAt,
		};
	}
}
