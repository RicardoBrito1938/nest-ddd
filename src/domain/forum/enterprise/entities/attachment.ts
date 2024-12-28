import { Entity } from "@/core/entities/entity";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface AttachmentProps {
	title: string;
	url: string;
}

export class Attachment extends Entity<AttachmentProps> {
	get title() {
		return this.props.title;
	}

	get url() {
		return this.props.url;
	}

	static create(props: AttachmentProps, id?: UniqueEntityId) {
		return new Attachment(props, id);
	}
}
