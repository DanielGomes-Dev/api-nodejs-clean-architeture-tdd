const { MissingParamError, InvalidParamError } = require('../../utils/errors')
class AuthUseCase {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth (email, password) {
    if (!email) throw new MissingParamError('email') // Retornar error para ser tratado na frente;
    if (!password) throw new MissingParamError('password') // Retornar error para ser tratado na frente;
    if (!this.loadUserByEmailRepository) throw new MissingParamError('loadUserByEmailRepository')
    if (!this.loadUserByEmailRepository.load) throw new InvalidParamError('loadUserByEmailRepository')

    this.loadUserByEmailRepository.load(email)
  }
}

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()

  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)

  return { sut, loadUserByEmailRepositorySpy }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth() // retorna uma promisse
    expect(promise).rejects.toThrow(new MissingParamError('email')) // Testando excessões com jest
  })

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@mail.com') // retorna uma promisse
    expect(promise).rejects.toThrow(new MissingParamError('password')) // Testando excessões com jest
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password') // retorna uma promisse
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com') // Testando excessões com jest
  })

  test('Should throw if no LoadUserRepository is provided', () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@mail.com', 'any_password') // retorna uma promisse
    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository')) // Testando excessões com jest
  })

  test('Should throw if no LoadUserByEmailRepository has no load method', () => {
    const sut = new AuthUseCase({}) // testando com objeto vazio
    const promise = sut.auth('any_email@mail.com', 'any_password') // retorna uma promisse
    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository')) // Testando excessões com jest
  })
})
