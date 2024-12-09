import { EditQuestionUseCase } from "./edit-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachments";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);

		sut = new EditQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionAttachmentsRepository,
		);
	});

	it("should be able to edit a question", async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId("author-1"),
			},
			new UniqueEntityId("question-1"),
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId("1"),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId("2"),
			}),
		);

		await sut.execute({
			questionId: newQuestion.id.toValue(),
			authorId: "author-1",
			title: "New title",
			content: "New content",
			attachmentIds: ["1", "3"],
		});

		expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
			title: "New title",
			content: "New content",
		});
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toEqual([
			expect.objectContaining({
				attachmentId: new UniqueEntityId("1"),
			}),
			expect.objectContaining({
				attachmentId: new UniqueEntityId("3"),
			}),
		]);
	});

	it("should not be able to edit a question from another user", async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId("author-1"),
			},
			new UniqueEntityId("question-1"),
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			questionId: newQuestion.id.toValue(),
			authorId: "author-2",
			title: "Pergunta teste",
			content: "Conteúdo teste",
			attachmentIds: [],
		});
		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
