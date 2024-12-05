import { z } from "zod";

export const envSchema = z.object({
	PORT: z.coerce.number().optional().default(3333),
	JWT_SECRET: z.string(),
	DATABASE_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;
