import { Controller, HttpCode, Post } from "@nestjs/common";
import type { PrismaService } from "src/prisma/prisma.service";

@Controller("/accounts")
export class CreateAccountController {
	constructor(private prisma: PrismaService) {}

	@Post()
	@HttpCode(201)
	async handle() {
		const name = "John Doe";
		const email = "ßjohndoe@mail.com";
		const password = "123456";
		await this.prisma.user.create({
			data: {
				name,
				email,
				password,
			},
		});
	}
}
