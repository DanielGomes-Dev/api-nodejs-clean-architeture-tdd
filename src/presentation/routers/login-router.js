const httpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) return httpResponse.badRequest('email')
      if (!password) return httpResponse.badRequest('password')

      const acessToken = this.authUseCase.auth(email, password)
      if (!acessToken) return await httpResponse.unauthorizedError()

      return httpResponse.ok(acessToken)
    } catch (error) {
      // console.error(error)
      return httpResponse.serverError()
    }
  }
}
