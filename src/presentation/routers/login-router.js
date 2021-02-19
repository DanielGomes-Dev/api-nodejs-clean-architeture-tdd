const httpResponse = require('../helpers/http-response')
const MissingParamError = require('../helpers/missing-param-error')
module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body

      if (!email) return httpResponse.badRequest(new MissingParamError('email'))
      // if (!/email/.test(email)) return httpResponse.badRequest('email')

      if (!password) return httpResponse.badRequest(new MissingParamError('password'))

      const acessToken = this.authUseCase.auth(email, password)
      if (!acessToken) return await httpResponse.unauthorizedError()

      return httpResponse.ok(acessToken)
    } catch (error) {
      // console.error(error)
      return httpResponse.serverError()
    }
  }
}
