import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CreateQuestionUseCase } from "./create-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CreateQuestionUseCase;

describe("Create question", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
	});

	it("create a question", async () => {
		const result = await sut.execute({
			authorId: "1",
			title: "New question",
			content: "Content",
			attachmentsIds: ["1", "2"],
		});

		expect(result.isRight()).toBeTruthy();
		expect(inMemoryQuestionsRepository.items).toHaveLength(1);
		expect(inMemoryQuestionsRepository.items[0]).toEqual(
			result.value?.question,
		);
		expect(result.value?.question.attachments.currentItems).toHaveLength(2);
	});

	it("should persist attachment when creating a new question", async () => {
		const result = await sut.execute({
			authorId: "1",
			title: "New question",
			content: "Content",
			attachmentsIds: ["1", "2"],
		});

		expect(result.isRight()).toBeTruthy();
		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2);
		expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
			result.value?.question.attachments.currentItems,
		);
		expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId:
						result.value?.question.attachments.currentItems[0].attachmentId,
					questionId: result.value?.question.id,
				}),
				expect.objectContaining({
					attachmentId:
						result.value?.question.attachments.currentItems[1].attachmentId,
					questionId: result.value?.question.id,
				}),
			]),
		);
	});
});
