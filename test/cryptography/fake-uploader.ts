import { randomUUID } from "node:crypto";
import {
	UploadParams,
	Uploader,
} from "@/domain/forum/application/storage/uploader";

interface Upload {
	fileName: string;
	url: string;
}

export class FakeUploaded implements Uploader {
	private uploads: Upload[] = [];

	async upload(params: UploadParams): Promise<{ url: string }> {
		const url = randomUUID();

		this.uploads.push({
			fileName: params.fileName,
			url,
		});

		return { url };
	}
}
