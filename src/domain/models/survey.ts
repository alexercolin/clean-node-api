import { SurveyAnswer } from '../usecases/add-survey'

export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswer[]
  date: Date
}
