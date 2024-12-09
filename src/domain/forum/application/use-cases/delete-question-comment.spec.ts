import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete question comment", () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository();
		sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
	});

	it("should be able to delete a question comment", async () => {
		const questionComment = makeQuestionComment();

		await inMemoryQuestionCommentsRepository.create(questionComment);

		await sut.execute({
			questionCommentId: questionComment.id.toString(),
			authorId: questionComment.authorId.toString(),
		});

		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
	});

	it("Should not be able to delete another user question comment", async () => {
		const questionComment = makeQuestionComment({
			authorId: new UniqueEntityId("author-1"),
		});

		await inMemoryQuestionCommentsRepository.create(questionComment);

		const result = await sut.execute({
			questionCommentId: questionComment.id.toString(),
			authorId: "author-2",
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);

		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1);
	});
});
