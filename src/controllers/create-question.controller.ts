import { Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { TokenPayload } from "src/auth/jwt.strategy";
import { PrismaService } from "src/prisma/prisma.service";

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private prisma: PrismaService) {}

	@Post()
	async handle(@CurrentUser() user: TokenPayload) {
		console.log(user);
		return "ok";
	}
}
