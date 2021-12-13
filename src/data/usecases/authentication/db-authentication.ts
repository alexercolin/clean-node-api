import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashCompare } from '../../protocols/criptography/hash-compare'
import { LoadAccountByEmailRespository } from '../../protocols/db/load-account--by-email-respository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRespository: LoadAccountByEmailRespository
  private readonly hashCompare: HashCompare
  constructor (loadAccountByEmailRespository: LoadAccountByEmailRespository, hashCompare: HashCompare) {
    this.loadAccountByEmailRespository = loadAccountByEmailRespository
    this.hashCompare = hashCompare
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRespository.load(authentication.email)
    if (account) {
      await this.hashCompare.compare(authentication.password, account.password)
    }
    return null
  }
}
