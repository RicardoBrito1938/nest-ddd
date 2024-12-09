import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { makeAnswer } from "test/factories/make-annswer";

import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachment-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe("Comment on Answer", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		sut = new CommentOnAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerCommentsRepository,
		);
	});

	it("should be able to comment on answer", async () => {
		const answer = makeAnswer();
		await inMemoryAnswersRepository.create(answer);
		const content = "This is a comment";
		await sut.execute({
			answerId: answer.id.toString(),
			authorId: answer.authorId.toString(),
			content,
		});
		expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(content);
	});
});
