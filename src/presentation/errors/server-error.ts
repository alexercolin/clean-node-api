export class ServerError extends Error {
  constructor () {
    super('Internal Server error')
    this.name = 'Server Error'
  }
}
