const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true

  return encrypterSpy
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email

      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'any_password_hashed'
  }
  return loadUserByEmailRepositorySpy
}

const makeTokenGenerator = () => {
  class TokenGenerator {
    async generate (userId) {
      this.userId = userId
      return this.accesToken
    }
  }
  const tokenGeneratorSpy = new TokenGenerator()
  tokenGeneratorSpy.accesToken = 'any_token'
  return tokenGeneratorSpy
}
const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const tokenGeneratorSpy = makeTokenGenerator()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })

  return { sut, loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy }
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

  test('Should return null if invalid email provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password') // retorna uma promisse
    expect(accessToken).toBe(null)
  })

  test('Should return null if invalid password provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password') // retorna uma promisse
    expect(accessToken).toBe(null)
  })

  test('Should call encrypterHelper with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password') // retorna uma promisse
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  test('Should call TokenGenerator with correct userId', async () => {
    const { sut, tokenGeneratorSpy, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password') // retorna uma promisse
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  test('Should return any_access token if correct credentials is provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('valid_email@mail.com', 'valid_password') // retorna uma promisse
    expect(accessToken).toBe(tokenGeneratorSpy.accesToken)
    expect(accessToken).toBeTruthy() // algo diferente de falsy
  })

  test('Should throw if invalids dependency is provided', () => {
    const invalid = {}
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const tokenGenerator = makeTokenGenerator()
    const encrypter = makeEncrypter()
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({ loadUserByEmailRepository: null, encrypter, tokenGenerator }),
      new AuthUseCase({ loadUserByEmailRepository: invalid, encrypter, tokenGenerator }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter: null, tokenGenerator }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter: invalid, tokenGenerator }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator: null }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator: invalid })
    )

    for (const sut of suts) {
      const promise = sut.auth('any_email@mail.com', 'any_password') // retorna uma promisse
      expect(promise).rejects.toThrow() // Testando excessões com jest
    }
  })
})
