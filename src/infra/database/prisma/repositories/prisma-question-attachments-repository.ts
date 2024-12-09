import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	constructor(private prisma: PrismaService) {}

	findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
		throw new Error("Method not implemented.");
	}
	deleteManyByQuestionId(questionId: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
