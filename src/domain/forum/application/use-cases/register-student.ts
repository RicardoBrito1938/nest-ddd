import { Student } from "@/domain/forum/enterprise/entities/student";
import { StudentsRepository } from "../repositories/students-repository";
import { type Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { HashGenerator } from "../cryptography/hash-generator";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";

interface CreateStudentUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

type CreateStudentUseCaseResponse = Either<
	StudentAlreadyExistsError,
	{
		student: Student;
	}
>;

@Injectable()
export class CreateStudentUseCase {
	constructor(
		private studentsRepository: StudentsRepository,
		private hashGenerator: HashGenerator,
	) {}

	async execute({
		email,
		name,
		password,
	}: CreateStudentUseCaseRequest): Promise<CreateStudentUseCaseResponse> {
		const studentWithSameEmail =
			await this.studentsRepository.findByEmail(email);

		if (studentWithSameEmail) {
			return left(new StudentAlreadyExistsError(email));
		}

		const hashedPassword = await this.hashGenerator.hash(password);

		const student = Student.create({
			email,
			name,
			password: hashedPassword,
		});

		await this.studentsRepository.create(student);

		return right({
			student,
		});
	}
}
