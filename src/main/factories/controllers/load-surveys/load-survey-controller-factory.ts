import { LoadSurveysController } from '../../../../presentation/controllers/survey/load-surveys/load-survey-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbLoadSurvey } from '../../usecases/add-survey/db-load-survey-factory'

export const makeLoadSurveyController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurvey())
  return makeLogControllerDecorator(controller)
}
