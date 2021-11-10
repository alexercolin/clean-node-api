import { ServerError } from '../errors'
import { HttpResponse } from '../protocols/http'

// usei o parenteses sem o return na resposta da arrow function, é um sintax sugar
export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
