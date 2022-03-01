import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoadSurveyController } from '../factories/controllers/load-surveys/load-survey-controller-factory'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  const auth = adaptMiddleware(makeAuthMiddleware())
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/surveys', auth, adaptRoute(makeLoadSurveyController()))
}
