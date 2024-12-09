import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { SendNotificationUseCase } from "./send-notification";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe("Create notification", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
	});

	it("send a notification", async () => {
		const result = await sut.execute({
			recipientId: "1",
			title: "Nova notificação",
			content: "Conteúdo da notificação",
		});

		expect(result.isRight()).toBeTruthy();
		expect(inMemoryNotificationsRepository.items).toHaveLength(1);
		expect(inMemoryNotificationsRepository.items[0]).toEqual(
			result.value?.notification,
		);
	});
});
