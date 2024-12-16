import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { CreateStudentUseCase } from "./register-student";
import { FakeHasher } from "test/cryptography/fake-hasher";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: CreateStudentUseCase;

describe("Create student", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		fakeHasher = new FakeHasher();
		sut = new CreateStudentUseCase(inMemoryStudentsRepository, fakeHasher);
	});

	it("create a student", async () => {
		const result = await sut.execute({
			email: "valid_email",
			name: "valid_name",
			password: "valid_password",
		});

		expect(result.isRight()).toBeTruthy();
		expect(inMemoryStudentsRepository.items).toHaveLength(1);
		expect(result.value).toEqual({
			student: inMemoryStudentsRepository.items[0],
		});
	});

	it("Should hash student up on registration", async () => {
		const result = await sut.execute({
			email: "valid_email",
			name: "valid_name",
			password: "valid_password",
		});

		expect(result.isRight()).toBeTruthy();
		expect(inMemoryStudentsRepository.items).toHaveLength(1);
		expect(result.value).toEqual({
			student: inMemoryStudentsRepository.items[0],
		});
		expect(inMemoryStudentsRepository.items[0].password).toEqual(
			"valid_password-hashed",
		);
	});
});
