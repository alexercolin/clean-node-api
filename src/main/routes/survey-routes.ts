import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoadSurveyController } from '../factories/controllers/load-surveys/load-survey-controller-factory'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey-controller-factory'
import { adminAuth } from '../middlewares/admin-auth'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/surveys', auth, adaptRoute(makeLoadSurveyController()))
}
