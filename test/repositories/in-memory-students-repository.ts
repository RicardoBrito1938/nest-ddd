import type { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import type { Student } from "@/domain/forum/enterprise/entities/student";
import { DomainEvents } from "@/core/events/domain-events";

export class InMemoryStudentsRepository implements StudentsRepository {
	public items: Student[] = [];

	async create(student: Student): Promise<void> {
		this.items.push(student);

		DomainEvents.dispatchEventsForAggregate(student.id);

		return Promise.resolve();
	}

	findByEmail(email: string): Promise<Student | null> {
		const student = this.items.find((student) => student.email === email);

		return Promise.resolve(student || null);
	}
}
