const router = require('express').Router()
const LoginRouter = require('../../presentation/routers/login-router')
const AuthUseCase = require('../../domain/usecases/auth-usecase')
const EmailValidator = require('../../utils/EmailValidator/email-validator')

module.exports = router => {
    const emailValidator = new EmailValidator()
    const authUseCase = new AuthUseCase()
    const loginRouter = new LoginRouter()
    router.post('/login', loginRouter)
}