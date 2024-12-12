import { DeleteAnswerUseCase } from "./delete-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { makeAnswerAttachment } from "test/factories/make-answer-attachments";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete answer", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
	});

	it("Should be able to delete a answer", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId("1"),
			},
			new UniqueEntityId("answer-1"),
		);

		await inMemoryAnswersRepository.create(newAnswer);

		inMemoryAnswerAttachmentsRepository.items.push(
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId("1"),
			}),
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId("2"),
			}),
		);

		await sut.execute({
			answerId: "answer-1",
			authorId: "1",
		});

		expect(inMemoryAnswersRepository.items.length).toBe(0);
		expect(inMemoryAnswerAttachmentsRepository.items.length).toBe(0);
	});

	it("Should be able to delete a answer from another user", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId("1"),
			},
			new UniqueEntityId("answer-1"),
		);

		await inMemoryAnswersRepository.create(newAnswer);

		const result = await sut.execute({
			answerId: "answer-1",
			authorId: "2",
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
