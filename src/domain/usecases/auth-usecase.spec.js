const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
    }
  }
  const encrypterSpy = new EncrypterSpy()
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email

      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = { password: 'any_password_hashed' }

  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy)

  return { sut, loadUserByEmailRepositorySpy, encrypterSpy }
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

  test('Should return null if invalid email provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password') // retorna uma promisse
    expect(accessToken).toBe(null)
  })

  test('Should return null if invalid password provided', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password') // retorna uma promisse
    expect(accessToken).toBe(null)
  })

  test('Should call encrypterHelper with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password') // retorna uma promisse
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })
})
