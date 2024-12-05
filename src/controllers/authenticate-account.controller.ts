import {
	Body,
	Controller,
	HttpCode,
	Post,
	UnauthorizedException,
	UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { JwtService } from "@nestjs/jwt";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { compare } from "bcrypt";

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

type AuthenticateBodySchemaType = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
	constructor(
		private jwt: JwtService,
		private prisma: PrismaService,
	) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() body: AuthenticateBodySchemaType) {
		const { password, email } = body;

		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			throw new UnauthorizedException("User credentials do not match.");
		}

		const isPasswordValid = await compare(password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException("User credentials do not match.");
		}

		const accessToken = this.jwt.sign({ sub: user.id });

		return {
			access_token: accessToken,
		};
	}
}
