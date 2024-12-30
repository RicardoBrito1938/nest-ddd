import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { DomainEvents } from "@/core/events/domain-events";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env", override: true });
config({ path: ".env.test", override: true });

const prisma = new PrismaClient();

const generateUniqueDatabaseURL = async (schemaId: string) => {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not defined");
	}

	const url = new URL(process.env.DATABASE_URL);

	url.searchParams.set("schema", schemaId);

	return url.toString();
};

const schemaId = randomUUID();

beforeAll(async () => {
	const databaseUrl = await generateUniqueDatabaseURL(schemaId);

	process.env.DATABASE_URL = databaseUrl;

	DomainEvents.shouldRun = false;

	execSync("npx prisma migrate deploy");
});

afterAll(async () => {
	await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
	await prisma.$disconnect();
});
