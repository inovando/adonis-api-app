const Env = use('Env');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = Env.getOrFail('FROM_MAIL');

const sendTestEmail = async () => {
  const msg = {
    to: 'tiago.cristiano@inovan.do',
    from: FROM_EMAIL,
    subject: 'SendGrid Teste ',
    html: 'Corpo do email',
  };

  try {
    await sgMail.send(msg);
    return { msg: 'E-mail enviado com sucesso!' };
  } catch (error) {
    return error;
  }
};

const sendTemplateMail = async (to, assunto, text = 'email-text', html) => {
  const msg = {
    to: to,
    from: FROM_EMAIL,
    subject: assunto,
    text,
    html,
  };

  try {
    const sgMailResponse = await sgMail.send(msg);
    return { msg: 'E-mail enviado com sucesso!', sgMailResponse };
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { sendTestEmail, sendTemplateMail };
