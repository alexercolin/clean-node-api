import { AccountModel } from '../models/account'

export interface AddAccount {
  add: (account: AddAccountParams) => Promise<AccountModel>
}

export type AddAccountParams = Omit<AccountModel, 'id'>
