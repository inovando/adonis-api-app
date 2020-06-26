'use strict'

const User = use('App/Models/User')
const UserRepository = use('App/Repositories/UserRepository')

class AuthController {

  async register(ctx) {
    await UserRepository.store(ctx);
  }

  async login({ request, auth, response, transform }) {

    try {
      const { email, password } = request.all()
      const emailLower = email.toLowerCase()
      const authenticted = await auth.attempt(emailLower, password)
      if (authenticted) {

        const userAuthenticted = await User.findBy('email', emailLower);
        if (!userAuthenticted.status) {
          return response.status(401).json({ message: "Autenticação realizada com sucesso. Porem o usuário está INATIVO" })
        }
        const accessToken = await auth.generate(userAuthenticted)
        const user = await transform.item(userAuthenticted, `UserTransformer`);
        const profiles = await userAuthenticted.profiles().fetch()
        return response.json({ user, access_token: accessToken, profiles })

      }
      return response.status(401).json({ message: 'Unauthorized' })
    } catch (e) {
      return response.status(401).json({ message: 'Unauthorized' })
    }
  }

  async session({ response, auth, transform }) {
    const user = await User.findByOrFail('id', auth.user.id)
    return transform.item(user, 'UserTransformer')
  }

  async resetPassword({ request, response, view }) {

    const { email } = request.all()
    const emailLower = email.toLowerCase()
    const user = await User.findBy('email', emailLower)
    if (!user) {
      return response.status(403).json({ msg: "E-mail não localizado." })
    }
    const mailSend = await UserRepository.resetPassword(user, view)
    return response.status(200).json({ user, mailSend })

  }

  async updatePassword({ request, response }) {
    const { token, password } = request.all()

    const user = await User.findBy('reset_token', token)

    if (!user) {
      return response.status(403).json({ 'msg': "Token inválido ou expirado." })
    }
    user.password = password
    user.reset_token = ''
    await user.save()
    await user.reload()
    return response.status(200).json({ 'user': user.email })
  }
}

module.exports = AuthController
