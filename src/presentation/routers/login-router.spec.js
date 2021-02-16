class LoginRouter {
  route (httpRequest) {
    if (!httpRequest.body.email || !httpRequest.body.password) return { statusCode: 400 }
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
})
