import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	Student,
	StudentProps,
} from "@/domain/forum/enterprise/entities/student";
import { PrismaStudentMapper } from "@/infra/database/prisma/mappers/prisma-student-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export const makeStudent = (
	override: Partial<StudentProps> = {},
	id?: UniqueEntityId,
) => {
	const newStudent = Student.create(
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			...override,
		},
		id,
	);

	return newStudent;
};

@Injectable()
export class StudentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
		const student = makeStudent(data);
		await this.prisma.user.create({
			data: PrismaStudentMapper.toPersistence(student),
		});
		return student;
	}
}
