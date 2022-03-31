import { AccountModel } from '../models/account'
import { AddAccountParams } from '../usecases/add-account'

export const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'hashed_password'
})

export const makeFakeAccountData = (): AddAccountParams => ({
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})
