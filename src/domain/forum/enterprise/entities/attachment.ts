import { Entity } from "@/core/entities/entity";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface AttachmentProps {
	title: string;
	link: string;
}

export class Attachment extends Entity<AttachmentProps> {
	get title() {
		return this.props.title;
	}

	get link() {
		return this.props.link;
	}

	static create(props: AttachmentProps, id?: UniqueEntityId) {
		return new Attachment(props, id);
	}
}
