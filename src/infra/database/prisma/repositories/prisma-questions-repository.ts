import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { Injectable } from "@nestjs/common";
import { PrismaQuestionDetailsMapper } from "../mappers/prisma-question-details-mapper";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentsRepository } from "./prisma-question-attachments-repository";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	constructor(
		private prisma: PrismaService,
		private questionAttachmentsRepository: QuestionAttachmentsRepository,
		private cacheRepository: CacheRepository,
	) {}

	async findById(questionId: string): Promise<Question | null> {
		const question = await this.prisma.question.findUnique({
			where: {
				id: questionId,
			},
		});

		if (!question) {
			return null;
		}

		return PrismaQuestionMapper.toDomain(question);
	}

	async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = await this.prisma.question.findMany({
			orderBy: {
				createdAt: "desc",
			},
			skip: (page - 1) * 20,
			take: 20,
		});

		return questions.map(PrismaQuestionMapper.toDomain);
	}

	async create(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPersistence(question);

		await this.prisma.question.create({
			data,
		});

		await this.questionAttachmentsRepository.createMany(
			question.attachments.getItems(),
		);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async getBySlug(slug: string): Promise<Question | null> {
		const question = await this.prisma.question.findUnique({
			where: {
				slug,
			},
		});

		if (!question) {
			return null;
		}

		return PrismaQuestionMapper.toDomain(question);
	}

	async getBySlugWithDetails(slug: string): Promise<QuestionDetails | null> {
		const cachedQuestionDetails = await this.cacheRepository.get(
			`question:${slug}:details`,
		);

		if (cachedQuestionDetails) {
			return JSON.parse(cachedQuestionDetails);
		}

		const question = await this.prisma.question.findUnique({
			where: {
				slug,
			},
			include: {
				author: true,
				attachments: true,
			},
		});

		if (!question) {
			return null;
		}

		const questionDetails = PrismaQuestionDetailsMapper.toDomain(question);

		await this.cacheRepository.set(
			`question:${slug}:details`,
			JSON.stringify(questionDetails),
		);

		return questionDetails;
	}

	async delete(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPersistence(question);

		await this.prisma.question.delete({
			where: {
				id: data.id,
			},
		});
	}

	async update(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPersistence(question);

		await Promise.all([
			this.prisma.question.update({
				where: {
					id: data.id,
				},
				data,
			}),
			this.questionAttachmentsRepository.createMany(
				question.attachments.getNewItems(),
			),
			this.questionAttachmentsRepository.deleteMany(
				question.attachments.getRemovedItems(),
			),
			this.cacheRepository.delete(`question:${data.slug}:details`),
		]);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}
}
