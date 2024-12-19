import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe("Fetch question answers", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
	});

	it("Should be able to fetch question answers", async () => {
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityId("question-1"),
			}),
		);
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityId("question-1"),
			}),
		);
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityId("question-1"),
			}),
		);

		const result = await sut.execute({
			questionId: "question-1",
			page: 1,
		});

		expect(result?.value?.answers.length).toBe(3);
	});
});
