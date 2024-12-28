import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { TokenPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Put,
} from "@nestjs/common";
import { z } from "zod";

const editQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
	attachmentIds: z.array(z.string().uuid()),
});

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller("/questions/:id")
export class EditQuestionController {
	constructor(private editQuestion: EditQuestionUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@Body(bodyValidationPipe) body: EditQuestionBodySchema,
		@CurrentUser() user: TokenPayload,
		@Param("id") questionId: string,
	) {
		const { title, content, attachmentIds } = body;
		const userId = user.sub;

		const result = await this.editQuestion.execute({
			title,
			content,
			authorId: userId,
			attachmentIds,
			questionId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
