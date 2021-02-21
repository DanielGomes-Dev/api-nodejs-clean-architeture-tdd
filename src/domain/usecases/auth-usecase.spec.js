const { MissingParamError } = require('../../utils/errors')
class AuthUseCase {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth (email, password) {
    if (!email) throw new MissingParamError('email') // Retornar error para ser tratado na frente;
    if (!password) throw new MissingParamError('password') // Retornar error para ser tratado na frente;
    this.loadUserByEmailRepository.load(email)
  }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth() // retorna uma promisse
    expect(promise).rejects.toThrow(new MissingParamError('email')) // Testando excessões com jest
  })

  test('Should throw if no password is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@mail.com') // retorna uma promisse
    expect(promise).rejects.toThrow(new MissingParamError('password')) // Testando excessões com jest
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    class LoadUserByEmailRepositorySpy {
      async load (email) {
        this.email = email
      }
    }
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()

    const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
    await sut.auth('any_email@mail.com', 'any_password') // retorna uma promisse
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com') // Testando excessões com jest
  })
})
