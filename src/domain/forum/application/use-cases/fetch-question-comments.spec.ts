import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { FetchQuestionCommentsCase } from "./fetch-question-comments";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsCase;

describe("Fetch question comments", () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository();
		sut = new FetchQuestionCommentsCase(inMemoryQuestionCommentsRepository);
	});

	it("Should be able to fetch question comments", async () => {
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityId("question-1"),
			}),
		);
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityId("question-1"),
			}),
		);
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityId("question-1"),
			}),
		);

		const result = await sut.execute({
			questionId: "question-1",
			page: 1,
		});

		expect(result?.value?.questionComment.length).toBe(3);
	});
});
