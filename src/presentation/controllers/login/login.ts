import { Controller, HttpRequest, HttpResponse } from './login-protocols'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredField = ['email']
    return badRequest(new MissingParamError(requiredField[0]))
  }
}
