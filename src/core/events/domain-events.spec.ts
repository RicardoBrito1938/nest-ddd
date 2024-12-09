import { AggregateRoot } from "../entities/aggregate-root";
import type { UniqueEntityId } from "../entities/unique-entity-id";
import type { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";

class CustomAggregateCreated implements DomainEvent {
	public occurredAt: Date;
	private aggregate: CustomAggregate;

	constructor(aggregate: CustomAggregate) {
		this.aggregate = aggregate;
		this.occurredAt = new Date();
	}

	public getAggregateId(): UniqueEntityId {
		return this.aggregate.id;
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
class CustomAggregate extends AggregateRoot<any> {
	static create() {
		const aggregate = new CustomAggregate(null);

		aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

		return aggregate;
	}
}

describe("DomainEvents", () => {
	it("should dispatch events for marked aggregates", () => {
		const callbackSpy = vi.fn();
		DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

		const aggregate = CustomAggregate.create();

		expect(aggregate.domainEvents).toHaveLength(1);

		DomainEvents.dispatchEventsForAggregate(aggregate.id);

		expect(callbackSpy).toHaveBeenCalledTimes(1);
		expect(aggregate.domainEvents).toHaveLength(0);
	});
});
