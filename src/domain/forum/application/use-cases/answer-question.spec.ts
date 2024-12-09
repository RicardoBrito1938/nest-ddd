import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { AnswerQuestionUseCase } from "./answer-question";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

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
			instructorId: "1",
			content: "Answer",
			attachmentIds: ["1", "2"],
		});

		expect(result.isRight()).toBeTruthy();
		expect(inMemoryAnswersRepository.items).toHaveLength(1);
		expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
		expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
		expect(result.value?.answer.attachments.currentItems).toHaveLength(2);
	});
});
