import { AccountModel, AddAccountParams, Hasher, AddAccountRepository, LoadAccountByEmailRespository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { makeFakeAccount, makeFakeAccountData } from '@/domain/test'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRespository => {
  class LoadAccountByEmailRespositoryStub implements LoadAccountByEmailRespository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new LoadAccountByEmailRespositoryStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRespositoryStub: LoadAccountByEmailRespository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRespositoryStub = makeLoadAccountByEmailRepository()
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRespositoryStub)
  return {
    sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRespositoryStub
  }
}
describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashertSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeAccountData())
    expect(hashertSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addtSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAccountData())
    expect(addtSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account if on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })

  test('Should return null if  account if loadAccountByEmailRespositoryStub not returns null', async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRespositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeAccount())))
    const account = await sut.add(makeFakeAccountData())
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRespository with correct email', async () => {
    const { sut, loadAccountByEmailRespositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRespositoryStub, 'loadByEmail')
    await sut.add(makeFakeAccountData())
    expect(loadSpy).toHaveBeenCalledWith('valid_email@email.com')
  })
})
