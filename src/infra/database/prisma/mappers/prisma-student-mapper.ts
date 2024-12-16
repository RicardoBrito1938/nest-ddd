import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Prisma, User as PrismaUser } from "@prisma/client";

export class PrismaStudentMapper {
	static toDomain(raw: PrismaUser): Student {
		return Student.create(
			{
				email: raw.email,
				name: raw.name,
				password: raw.password,
			},
			new UniqueEntityId(raw.id),
		);
	}

	static toPersistence(student: Student): Prisma.UserUncheckedCreateInput {
		return {
			id: student.id.toString(),
			email: student.email,
			name: student.name,
			password: student.password,
		};
	}
}
