import { Attachment } from "../../enterprise/entities/attachment";

export abstract class AttachmentsRepository {
	abstract create(answer: Attachment): Promise<void>;
}
