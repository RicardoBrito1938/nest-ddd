import { HashComparer } from "@/domain/forum/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator, HashComparer {
	async hash(payload: string): Promise<string> {
		return payload.concat("-hashed");
	}

	async compare(payload: string, hashed: string): Promise<boolean> {
		return payload.concat("-hashed") === hashed;
	}
}
