import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { FetchRecentQuestionsCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { CreateStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/authenticate-account.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug.controller";

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateQuestionController,
		FetchRecentQuestionsController,
		GetQuestionBySlugController,
	],
	providers: [
		CreateQuestionUseCase,
		FetchRecentQuestionsCase,
		AuthenticateStudentUseCase,
		CreateStudentUseCase,
		GetQuestionBySlugUseCase,
	],
})
export class HttpModule {}
