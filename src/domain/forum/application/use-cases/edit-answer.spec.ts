import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "./../../../../../test/repositories/in-memory-answer-attachment-repository";
import { EditAnswerUseCase } from "./edit-answer";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { makeAnswerAttachment } from "test/factories/make-answer-attachments";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		sut = new EditAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerAttachmentsRepository,
		);
	});

	it("should be able to edit a answer", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId("author-1"),
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
			answerId: newAnswer.id.toValue(),
			authorId: "author-1",
			content: "New content",
			attachmentIds: ["1", "3"],
		});

		expect(inMemoryAnswersRepository.items[0]).toMatchObject({
			content: "New content",
		});
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
			[
				expect.objectContaining({
					attachmentId: new UniqueEntityId("1"),
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityId("3"),
				}),
			],
		);
	});

	it("should not be able to edit a answer from another user", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId("author-1"),
			},
			new UniqueEntityId("answer-1"),
		);

		await inMemoryAnswersRepository.create(newAnswer);

		const result = await sut.execute({
			answerId: newAnswer.id.toValue(),
			authorId: "author-2",
			content: "Conteúdo teste",
			attachmentIds: [],
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});

	it("should sync new and removed attachment when editing an answer", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId("author-1"),
			},
			new UniqueEntityId("question-1"),
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
		const result = await sut.execute({
			answerId: newAnswer.id.toValue(),
			authorId: "author-1",
			content: "Conteúdo teste",
			attachmentIds: ["1", "3"],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2);
		expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId: new UniqueEntityId("1"),
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityId("3"),
				}),
			]),
		);
	});
});
