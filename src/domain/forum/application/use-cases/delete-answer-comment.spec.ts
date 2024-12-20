import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswerComment } from "test/factories/make-answer-comments";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete answer comment", () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
	});

	it("should be able to delete a answer comment", async () => {
		const answerComment = makeAnswerComment();

		await inMemoryAnswerCommentsRepository.create(answerComment);

		await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: answerComment.authorId.toString(),
		});

		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
	});

	it("Should not be able to delete another user answer comment", async () => {
		const answerComment = makeAnswerComment({
			authorId: new UniqueEntityId("author-1"),
		});

		await inMemoryAnswerCommentsRepository.create(answerComment);

		const result = await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: "author-2",
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);

		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1);
	});
});
