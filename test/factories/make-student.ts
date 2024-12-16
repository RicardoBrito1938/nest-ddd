import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	Student,
	type StudentProps,
} from "@/domain/forum/enterprise/entities/student";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { faker } from "@faker-js/faker";

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
