import { badRequest, serverError, ok } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, AddAccount } from './signup-controller-protocols'
import { Validation } from '../../protocols/validation'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount,
    private readonly validation: Validation) {}

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
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
