import { LoginController } from './login'
import { badRequest, serverError } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator, HttpRequest } from './login-protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})

describe('Login Controller', () => {
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  describe('Login Controller', () => {
    test('Should call EmailValidator with correct email', async () => {
      const { sut, emailValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
      const httpRequest = await sut.handle(makeFakeRequest())
      await sut.handle(httpRequest)
      expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
  })

  describe('Login Controller', () => {
    test('Should return 400 if an email provided is invalid', async () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })
  })

  describe('Login Controller', () => {
    test('Should return 500 if an email validator throws', async () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })
      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse).toEqual(serverError(new Error()))
    })
  })
})
