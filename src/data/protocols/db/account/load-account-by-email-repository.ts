import { AccountModel } from '../../../../domain/models/account'

export interface LoadAccountByEmailRespository {
  loadByEmail: (email: string) => Promise<AccountModel>
}
