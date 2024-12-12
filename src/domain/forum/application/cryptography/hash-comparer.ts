export abstract class HashComparer {
	abstract compare(payload: string, hashed: string): Promise<boolean>;
}
