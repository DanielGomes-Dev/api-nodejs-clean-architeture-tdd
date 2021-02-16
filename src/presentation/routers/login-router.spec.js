class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) return { statusCode: 500 }
    const { email, password } = httpRequest.body
    if (!email || !password) return { statusCode: 400 }
  }
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    // sut System un Test
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        // email:'valid_email@mail.com',
        password: 'valid_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 400 if no password is provided', () => {
    // sut System un Test
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com'
        // password: 'valid_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 500 if no httprequest has no body', () => {
    // sut System un Test
    const sut = new LoginRouter()
    const httpRequest = {
      // body: {
      // email: 'valid_email@mail.com'
      // password: 'valid_password'
      // }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if no httpRequest is provided', () => {
    // sut System un Test
    const sut = new LoginRouter()

    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })
})
