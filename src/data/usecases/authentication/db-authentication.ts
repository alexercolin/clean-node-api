import {
  AuthenticationParams,
  Authentication,
  HashCompare,
  Encrypter,
  LoadAccountByEmailRespository,
  UpdateAccessTokenRepository
} from './db-authentications-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRespository: LoadAccountByEmailRespository,
    private readonly hashCompare: HashCompare, private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository) {}

  async auth (authentication: AuthenticationParams): Promise<string> {
    const account = await this.loadAccountByEmailRespository.loadByEmail(authentication.email)
    if (account) {
      const isValid = await this.hashCompare.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
