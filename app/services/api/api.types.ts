import { Question } from "../../models/question/question"
import { GeneralApiProblem } from "./api-problem"

export type GetQuestionsResult = { kind: "ok"; questions: Question[] } | GeneralApiProblem
export type GetQuestionResult = { kind: "ok"; question: Question } | GeneralApiProblem
