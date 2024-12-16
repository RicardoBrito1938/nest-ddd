import { HashComparer } from "@/domain/forum/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { compare, hash } from "bcrypt";

export class BcryptHasher implements HashGenerator, HashComparer {
	private HASH_SALT = 8;
	async hash(payload: string): Promise<string> {
		return hash(payload, this.HASH_SALT);
	}

	async compare(payload: string, hashed: string): Promise<boolean> {
		return compare(payload, hashed);
	}
}
