import { FakeUploader } from "test/cryptography/fake-uploader";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUpload: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and create attachment", () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		fakeUpload = new FakeUploader();
		sut = new UploadAndCreateAttachmentUseCase(
			inMemoryAttachmentsRepository,
			fakeUpload,
		);
	});

	it("should be able to upload and create an attachment", async () => {
		const result = await sut.execute({
			body: Buffer.from("valid_body"),
			fileName: "valid_file_name",
			fileType: "image/png",
		});
		const attachment = inMemoryAttachmentsRepository.items[0];

		expect(result.isRight()).toBeTruthy();
		expect(inMemoryAttachmentsRepository.items).toHaveLength(1);
		expect(result.value).toEqual({
			attachment: inMemoryAttachmentsRepository.items[0],
		});
		expect(attachment.title).toBe("valid_file_name");
	});

	it("should not be able to upload and create an attachment with invalid file type", async () => {
		const wrongFileType = ".mp4";

		const result = await sut.execute({
			body: Buffer.from("valid_body"),
			fileName: "valid_file_name",
			fileType: wrongFileType,
		});

		expect(result.isLeft()).toBeTruthy();
		expect(inMemoryAttachmentsRepository.items).toHaveLength(0);
		expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
	});
});
