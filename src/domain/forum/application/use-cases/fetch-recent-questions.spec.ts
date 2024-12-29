import { makeQuestion } from "test/factories/make-question";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FetchRecentQuestionsCase } from "./fetch-recent-questions";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchRecentQuestionsCase;

describe("Fetch recent questions", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
		);
		sut = new FetchRecentQuestionsCase(inMemoryQuestionsRepository);
	});

	it("Should be able to fetch recent questions", async () => {
		await inMemoryQuestionsRepository.create(
			makeQuestion({
				createdAt: new Date("2021-01-18"),
			}),
		);
		await inMemoryQuestionsRepository.create(
			makeQuestion({
				createdAt: new Date("2021-01-01"),
			}),
		);
		await inMemoryQuestionsRepository.create(
			makeQuestion({
				createdAt: new Date("2021-01-20"),
			}),
		);

		const result = await sut.execute({
			page: 1,
		});

		expect(result?.value?.questions.length).toBe(3);
		expect(result?.value?.questions).toEqual([
			expect.objectContaining({
				createdAt: new Date("2021-01-20"),
			}),
			expect.objectContaining({
				createdAt: new Date("2021-01-18"),
			}),
			expect.objectContaining({
				createdAt: new Date("2021-01-01"),
			}),
		]);
	});
});
