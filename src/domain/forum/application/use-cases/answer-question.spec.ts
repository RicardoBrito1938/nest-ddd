import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { AnswerQuestionUseCase } from "./answer-question";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("AnswerQuestionUseCase", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
	});

	it("should create an answer", async () => {
		const result = await sut.execute({
			questionId: "1",
			authorId: "1",
			content: "Answer",
			attachmentIds: ["1", "2"],
		});

		expect(result.isRight()).toBeTruthy();
		expect(inMemoryAnswersRepository.items).toHaveLength(1);
		expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
		expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
		expect(result.value?.answer.attachments.currentItems).toHaveLength(2);
	});

	it("should persist attachment when creating a new answer", async () => {
		const result = await sut.execute({
			questionId: "1",
			authorId: "1",
			content: "Content",
			attachmentIds: ["1", "2"],
		});

		expect(result.isRight()).toBeTruthy();
		expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2);
		expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
			result.value?.answer.attachments.currentItems,
		);
		expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId:
						result.value?.answer.attachments.currentItems[0].attachmentId,
				}),
				expect.objectContaining({
					attachmentId:
						result.value?.answer.attachments.currentItems[1].attachmentId,
				}),
			]),
		);
	});
});
