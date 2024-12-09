import type { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import type { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationsRepository
	implements NotificationsRepository
{
	public items: Notification[] = [];

	async create(notification: Notification): Promise<void> {
		this.items.push(notification);
		return Promise.resolve();
	}

	async findById(id: string): Promise<Notification | null> {
		const notification = this.items.find(
			(notification) => notification.id.toString() === id,
		);
		return Promise.resolve(notification || null);
	}

	async update(notification: Notification): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === notification.id.toString(),
		);

		this.items[itemIndex] = notification;
		return Promise.resolve();
	}
}
