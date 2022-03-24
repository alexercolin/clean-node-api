import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbSaveSurveyById } from '@/main/factories/usecases/survey-result/db-load-survey-by-id-factory copy'
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/survey-result/db-load-survey-result-factory'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbSaveSurveyById(), makeDbSaveSurveyResult())
  return makeLogControllerDecorator(controller)
}
