import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	findById(questionCommentId: string): Promise<QuestionComment | null> {
		throw new Error("Method not implemented.");
	}
	findManyByQuestionId(questionId: string): Promise<QuestionComment[]> {
		throw new Error("Method not implemented.");
	}
	create(questionComment: QuestionComment): Promise<void> {
		throw new Error("Method not implemented.");
	}
	delete(questionComment: QuestionComment): Promise<void> {
		throw new Error("Method not implemented.");
	}
	update(questionComment: QuestionComment): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
