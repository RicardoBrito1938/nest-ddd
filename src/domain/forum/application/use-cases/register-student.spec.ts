let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryStudentAttachmentsRepository: InMemoryStudentAttachmentsRepository;
let sut: CreateStudentUseCase;

describe("Create student", () => {
	beforeEach(() => {
		inMemoryStudentAttachmentsRepository =
			new InMemoryStudentAttachmentsRepository();
		inMemoryStudentsRepository = new InMemoryStudentsRepository(
			inMemoryStudentAttachmentsRepository,
		);
		sut = new CreateStudentUseCase(inMemoryStudentsRepository);
	});

	it("create a student", async () => {
		const result = await sut.execute({
			authorId: "1",
			title: "Nova pergunta",
			content: "Conteúdo da pergunta",
			attachmentsIds: ["1", "2"],
		});

		expect(result.isRight()).toBeTruthy();
		expect(inMemoryStudentsRepository.items).toHaveLength(1);
		expect(inMemoryStudentsRepository.items[0]).toEqual(result.value?.student);
		expect(result.value?.student.attachments.currentItems).toHaveLength(2);
	});
});
