import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashCompare } from '../../protocols/criptography/hash-compare'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRespository } from '../../protocols/db/load-account--by-email-respository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRespository: LoadAccountByEmailRespository
  private readonly hashCompare: HashCompare
  private readonly tokenGenerator: TokenGenerator
  constructor (loadAccountByEmailRespository: LoadAccountByEmailRespository, hashCompare: HashCompare, tokenGenerator: TokenGenerator) {
    this.loadAccountByEmailRespository = loadAccountByEmailRespository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRespository.load(authentication.email)
    if (account) {
      const isValid = await this.hashCompare.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        return accessToken
      }
    }
    return null
  }
}
