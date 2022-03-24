import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.put('/surveys/:surveyId/result', auth, adaptRoute(makeSaveSurveyResultController()))
}
