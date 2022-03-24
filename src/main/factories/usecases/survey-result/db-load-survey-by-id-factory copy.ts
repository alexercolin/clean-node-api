import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { DbLoadSurveyById } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbSaveSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}
