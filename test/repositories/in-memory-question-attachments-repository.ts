import type { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import type { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	public items: QuestionAttachment[] = [];

	async createMany(attachments: QuestionAttachment[]): Promise<void> {
		this.items.push(...attachments);
	}
	async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
		this.items = this.items.filter(
			(item) => !attachments.some((attachment) => attachment.equals(item)),
		);
	}

	async findManyByQuestionId(questionId: string) {
		const questionAttachments = this.items.filter(
			(item) => item.questionId.toString() === questionId,
		);
		return questionAttachments;
	}

	async deleteManyByQuestionId(questionId: string) {
		this.items = this.items.filter(
			(item) => item.questionId.toString() !== questionId,
		);
	}
}
