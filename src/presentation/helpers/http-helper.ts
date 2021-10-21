import { ServerError } from '../errors/server-error'
import { HttpResponse } from '../protocols/http'

// usei o parenteses sem o return na resposta da arrow function, é um sintax sugar
export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})
