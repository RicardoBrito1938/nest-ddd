import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswerComment } from "test/factories/make-answer-comments";
import { makeStudent } from "test/factories/make-student";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch answer comments", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
			inMemoryStudentsRepository,
		);
		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
	});

	it("Should be able to fetch answer comments", async () => {
		const student = makeStudent();

		const comment1 = makeAnswerComment({
			answerId: new UniqueEntityId("answer-1"),
			authorId: student.id,
		});
		const comment2 = makeAnswerComment({
			answerId: new UniqueEntityId("answer-1"),
			authorId: student.id,
		});
		const comment3 = makeAnswerComment({
			answerId: new UniqueEntityId("answer-1"),
			authorId: student.id,
		});

		await inMemoryStudentsRepository.items.push(student);

		await inMemoryAnswerCommentsRepository.create(comment1);
		await inMemoryAnswerCommentsRepository.create(comment2);
		await inMemoryAnswerCommentsRepository.create(comment3);

		const result = await sut.execute({
			answerId: "answer-1",
			page: 1,
		});

		expect(result.value?.comments.length).toBe(3);
		expect(result.isRight()).toBeTruthy();
		expect(result.value?.comments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					author: student.name,
					commentId: comment1.id,
				}),
				expect.objectContaining({
					author: student.name,
					commentId: comment2.id,
				}),
				expect.objectContaining({
					author: student.name,
					commentId: comment3.id,
				}),
			]),
		);
	});
});
