import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { TokenPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { z } from "zod";

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private prisma: PrismaService) {}

	@Post()
	async handle(
		@CurrentUser() user: TokenPayload,
		@Body(bodyValidationPipe) body: CreateQuestionBodySchema,
	) {
		const { content, title } = body;
		const { sub: userId } = user;

		const slug = this.convertToSlug(title);

		await this.prisma.question.create({
			data: {
				content,
				title,
				slug,
				authorId: userId,
			},
		});
	}

	private convertToSlug(text: string): string {
		return (
			text
				.toLowerCase()
				.normalize("NFD")
				// biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
				.replace(/[\u0300-\u036f]/g, "")
				.replace(/ /g, "-")
				.replace(/[^\w-]+/g, "")
		);
	}
}
