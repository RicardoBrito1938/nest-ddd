import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAnswerAttachmentRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaAnswersCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";

@Module({
	providers: [
		PrismaService,
		PrismaAnswerAttachmentRepository,
		PrismaQuestionAttachmentsRepository,
		PrismaQuestionCommentsRepository,
		PrismaQuestionsRepository,
		PrismaAnswersRepository,
		PrismaAnswersCommentsRepository,
		PrismaAnswerAttachmentRepository,
	],
	exports: [
		PrismaService,
		PrismaAnswerAttachmentRepository,
		PrismaQuestionAttachmentsRepository,
		PrismaQuestionCommentsRepository,
		PrismaQuestionsRepository,
		PrismaAnswersRepository,
		PrismaAnswersCommentsRepository,
		PrismaAnswerAttachmentRepository,
	],
})
export class DatabaseModule {}
