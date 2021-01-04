const Env = use('Env');
const Mail = use('Mail');

const FROM_EMAIL = Env.getOrFail('FROM_MAIL');

const sendEmail = async (to, assunto, data, view) => {
  try {
    await Mail.send(view, data, (message) => {
      message.from(FROM_EMAIL).to(to).subject(assunto);
    });

    return { msg: 'E-mail enviado com sucesso!' };
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { sendEmail };
