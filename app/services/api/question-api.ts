import { Api } from "./api"
import shuffle from 'lodash.shuffle'
import { v4 as uuidv4 } from "uuid"
import { decodeHTMLEntities } from '../../utils/html-decode'
import { ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { QuestionSnapshot } from "../../models/question/question"

const API_PAGE_SIZE = 50

const convertQuestion = (raw: any): QuestionSnapshot => {
  const id = uuidv4()
  const decodedQuestion = decodeHTMLEntities(raw.question)
  const decodedAnswers = shuffle(raw.incorrect_answers.concat([raw.correct_answer])).map(a => decodeHTMLEntities(a))
  return {
    id: id,
    category: raw.category,
    type: raw.type,
    difficulty: raw.difficulty,
    question: decodedQuestion,
    correctAnswer: raw.correct_answer,
    incorrectAnswers: raw.incorrect_answers,
    guess: raw.guess,
    answers: decodedAnswers
  }
}

export class QuestionApi {
    private api: Api;

    constructor(api: Api) {
      this.api = api
    }

    async getQuestions(): Promise<any> {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get("", { amount: API_PAGE_SIZE })

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      // transform the data into the format we are expecting
      try {
        const rawQuestions = response.data.results
        const convertedQuestions: QuestionSnapshot[] = rawQuestions.map(convertQuestion)

        const responseQuestions = { kind: "ok", questions: convertedQuestions }
        return responseQuestions
      } catch (e) {
        __DEV__ && console.tron.log(e.message)
        return { kind: "bad-data" }
      }
    }
}
