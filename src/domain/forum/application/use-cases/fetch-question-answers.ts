import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";

interface FetchQuestionAnswersCaseRequest {
	questionId: string;
	page: number;
}

type FetchQuestionAnswersCaseResponse = Either<
	null,
	{
		answers: Answer[];
	}
>;

Injectable();
export class FetchQuestionAnswersCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		questionId,
		page,
	}: FetchQuestionAnswersCaseRequest): Promise<FetchQuestionAnswersCaseResponse> {
		const answers = await this.answersRepository.findManyByQuestionId(
			questionId,
			{
				page,
			},
		);

		return right({ answers });
	}
}
