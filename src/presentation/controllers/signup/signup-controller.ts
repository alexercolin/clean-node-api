import { badRequest, serverError, ok, forbidden } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, AddAccount, Authentication } from './signup-controller-protocols'
import { Validation } from '../../protocols/validation'
import { EmailInUseError } from '../../errors'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }
    try {
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!account) return forbidden(new EmailInUseError())
      const token = await this.authentication.auth({
        email,
        password
      })
      return ok({ accessToken: token })
    } catch (error) {
      return serverError(error)
    }
  }
}
