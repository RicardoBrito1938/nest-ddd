import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { AuthenticateStudentUseCase } from "./authenticate-student";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe("Authenticate student", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		fakeHasher = new FakeHasher();
		fakeEncrypter = new FakeEncrypter();
		sut = new AuthenticateStudentUseCase(
			inMemoryStudentsRepository,
			fakeHasher,
			fakeEncrypter,
		);
	});

	it("authenticate a student", async () => {
		const student = makeStudent({
			email: "johndoe@mail.com",
			password: await fakeHasher.hash("123456"),
		});

		inMemoryStudentsRepository.items.push(student);

		const result = await sut.execute({
			email: "johndoe@mail.com",
			password: "123456",
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value).toEqual({
			accessToken: expect.any(String),
		});
	});
});
