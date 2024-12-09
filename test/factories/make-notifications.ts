import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import {
	Notification,
	type NotificationProps,
} from "@/domain/notification/enterprise/entities/notification";
import { faker } from "@faker-js/faker";

export const makeNotification = (
	override: Partial<NotificationProps> = {},
	id?: UniqueEntityId,
) => {
	const newNotification = Notification.create(
		{
			recipientId: new UniqueEntityId("1"),
			title: faker.lorem.sentence(4),
			content: faker.lorem.sentence(10),
			...override,
		},
		id,
	);

	return newNotification;
};
