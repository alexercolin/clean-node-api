import { Router } from 'express'
import { makeSignUpController } from '../factories/signup/signup-factory'
import { makeLoginController } from '../factories/login/login-factory'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/signup', adaptRoute(makeSignUpController()))
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/login', adaptRoute(makeLoginController()))
}
