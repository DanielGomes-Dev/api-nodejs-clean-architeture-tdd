class EmailValidator {
  isValid (email) {
    return true
  }
}

describe('Email Validator', () => {
  test('Should return true if validator return true', () => {
    const sut = new EmailValidator()
    const isEmailvalid = sut.isValid('valid_email@mail.com')
    expect(isEmailvalid).toBe(true)
  })
})
