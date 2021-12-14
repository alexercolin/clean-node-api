import { AccountModel } from '../../../domain/models/account'

export interface LoadAccountByEmailRespository {
  load: (email: string) => Promise<AccountModel>
}
