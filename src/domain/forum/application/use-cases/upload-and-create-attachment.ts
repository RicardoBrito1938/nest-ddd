import { type Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Attachment } from "../../enterprise/entities/attachment";
import { AttachmentsRepository } from "../repositories/attachments-repository";
import { Uploader } from "../storage/uploader";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";

interface UploadAndCreateAttachmentUseCaseRequest {
	fileName: string;
	fileType: string;
	body: Buffer;
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
	InvalidAttachmentTypeError,
	{
		attachment: Attachment;
	}
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
	constructor(
		private attachmentsRepository: AttachmentsRepository,
		private uploader: Uploader,
	) {}

	async execute({
		body,
		fileName,
		fileType,
	}: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
		if (
			!["image/png", "image/jpg", "image/jpeg", "application/pdf"].includes(
				fileType,
			)
		) {
			return left(new InvalidAttachmentTypeError(fileName));
		}

		const { url } = await this.uploader.upload({
			fileName,
			fileType,
			body,
		});

		const attachment = Attachment.create({
			title: fileName,
			url,
		});

		await this.attachmentsRepository.create(attachment);

		return right({
			attachment,
		});
	}
}
