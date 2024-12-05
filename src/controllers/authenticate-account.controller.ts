import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";
import { JwtService } from "@nestjs/jwt";

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

type AuthenticateBodySchemaType = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
	constructor(private jwt: JwtService) {}

	@Post()
	// @HttpCode(201)
	// @UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() body: AuthenticateBodySchemaType) {
		const token = this.jwt.sign({ sub: "user-id" });

		return token;
	}
}
