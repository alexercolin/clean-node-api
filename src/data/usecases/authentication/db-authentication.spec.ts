import { LoadAccountByEmailRespository } from '../../protocols/load-account--by-email-respository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRespository with correct email', async () => {
    class LoadAccountByEmailRespositoryStub implements LoadAccountByEmailRespository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password'
        }
        return await new Promise(resolve => resolve(account))
      }
    }
    const loadAccountByEmailRespositoryStub = new LoadAccountByEmailRespositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRespositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRespositoryStub, 'load')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
