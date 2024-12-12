export abstract class HashGenerator {
	abstract hash(payload: string): Promise<string>;
}
