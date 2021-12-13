import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRespository } from '../../protocols/db/load-account--by-email-respository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'

})

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRespositoryStub: LoadAccountByEmailRespository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRespositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRespositoryStub)
  return {
    sut, loadAccountByEmailRespositoryStub
  }
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRespository => {
  class LoadAccountByEmailRespositoryStub implements LoadAccountByEmailRespository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByEmailRespositoryStub()
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRespository with correct email', async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRespositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRespository throws', async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRespositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
