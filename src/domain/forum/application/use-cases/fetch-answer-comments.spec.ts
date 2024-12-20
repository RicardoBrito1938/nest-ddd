import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswerComment } from "test/factories/make-answer-comments";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch answer comments", () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
	});

	it("Should be able to fetch answer comments", async () => {
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityId("answer-1"),
			}),
		);
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityId("answer-1"),
			}),
		);
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityId("answer-1"),
			}),
		);

		const result = await sut.execute({
			answerId: "answer-1",
			page: 1,
		});

		expect(result.value?.answerComment.length).toBe(3);
		expect(result.isRight()).toBeTruthy();
	});
});
