const MissingParamError = require('./missing-param-error')
const UnauthorizedError = require('./unauthorized-error')

module.exports = class httpResponse {
  static ok (acessToken) {
    return {
      statusCode: 200,
      body: {
        accessToken: acessToken
      }
    }
  }

  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static serverError () {
    return {
      statusCode: 500
    }
  }
}