const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  async auth (email) {
    if (!email) throw new MissingParamError('email') // Retornar error para ser tratado na frente;
  }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth() // retorna uma promisse
    expect(promise).rejects.toThrow(new MissingParamError('email')) // Testando excessões com jest
  })
})
