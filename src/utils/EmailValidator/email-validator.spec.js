const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

const makeSut = () => {
  // Criar um makeSut para caso ela precise de alguma dependencia não sera nescessario alterar todos os testes;
  return new EmailValidator()
}

describe('Email Validator', () => {
  test('Should return true if validator return true', () => {
    const sut = makeSut()
    const isEmailvalid = sut.isValid('valid_email@mail.com')
    expect(isEmailvalid).toBe(true)
  })

  test('Should return false if validator return false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid_email@mail.com')

    expect(isEmailValid).toBe(false)
  })
})
