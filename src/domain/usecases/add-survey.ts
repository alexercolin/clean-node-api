export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}

export type AddSurveyParams = {
  question: string
  answers: SurveyAnswer[]
  date: Date
}

export interface SurveyAnswer {
  image?: string
  answer: string
}
