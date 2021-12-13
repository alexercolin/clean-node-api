import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRespository } from '../../protocols/load-account--by-email-respository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRespository: LoadAccountByEmailRespository
  constructor (loadAccountByEmailRespository: LoadAccountByEmailRespository) {
    this.loadAccountByEmailRespository = loadAccountByEmailRespository
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRespository.load(authentication.email)
    return null
  }
}
