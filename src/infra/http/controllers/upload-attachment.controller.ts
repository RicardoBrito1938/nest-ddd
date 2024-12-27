import { UploadAndCreateAttachmentUseCase } from "@/domain/forum/application/use-cases/upload-and-create-attachment";
import {
	BadRequestException,
	Controller,
	FileTypeValidator,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/attachments")
export class UploadAttachmentController {
	constructor(
		private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase,
	) {}

	@Post()
	@UseInterceptors(FileInterceptor("file"))
	async handle(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({
						maxSize: 1024 * 1024 * 2, // 2 MB
					}),
					new FileTypeValidator({ fileType: ".(png|jpg|jpeg|pdf)" }),
				],
			}),
		)
		file: Express.Multer.File,
	) {
		const result = await this.uploadAndCreateAttachment.execute({
			fileName: file.originalname,
			fileType: file.mimetype,
			body: file.buffer,
		});

		if (result.isLeft()) {
			throw new BadRequestException(result.value.message);
		}

		const { attachment } = result.value;

		return {
			attachmentId: attachment.id.toString(),
		};
	}
}
