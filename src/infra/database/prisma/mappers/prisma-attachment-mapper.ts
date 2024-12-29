import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { Prisma } from "@prisma/client";
import { Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaAttachmentMapper {
	static toDomain(raw: PrismaAttachment): Attachment {
		return Attachment.create(
			{
				title: raw.title,
				url: raw.url,
			},
			new UniqueEntityId(raw.id),
		);
	}

	static toPersistence(
		attachment: Attachment,
	): Prisma.AttachmentUncheckedCreateInput {
		return {
			id: attachment.id.toString(),
			title: attachment.title,
			url: attachment.url,
		};
	}
}
