require("dotenv").config();
//const nodemailer = require("nodemailer");

const myEmail = process.env.EMAIL_USER;
const resend = new Resend(process.env.RESEND_KEY);
//const passEmail = process.env.EMAIL_PASS;

/*const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: myEmail,
    pass: passEmail,
  },
});*/

const emailTransporter = async (userEmail, code, userTag) => {
  let mailOptions;
  if (userEmail === "feedback") {
    mailOptions = {
      from: "MyTube <onboarding@resend.dev>",
      to: myEmail,
      subject: `----Feedback de: ${userTag}----`,
      html: `
        <div style="background-color: #0F0F0F; padding: 20px;">
          <p style="color: #f5f5f5;">
            Feedback do site <strong>MyTube</strong>!
          </p>

          <h1 style="color: #f5f5f5;">
             ${code}
          </h1>
        </div>
      `,
    };
  } else {
    mailOptions = {
      from: "MyTube <onboarding@resend.dev>",
      to: userEmail,
      subject: "Confirmação de cadastro do MyTube :3",
      html: `
      <div style="background-color: #0F0F0F; padding: 20px;">
        <p style="color: #f5f5f5;">
          Obrigado por testar o cadastro do projeto <strong>MyTube</strong>!
        </p>

        <p style="color: #f5f5f5;">
          Seu código de confirmação:
        </p>

        <h1 style="color: #f5f5f5;">
          ${code}
        </h1>
      </div>
    `,
    };
  }

  //const check = await transporter.sendMail(mailOptions);
  try {
    const { data, error } = await resend.emails.send(mailOptions);

    if (error) {
      console.error("Erro Resend: ", error);
      return false;
    }
    return Boolean(data?.id);
  } catch (error) {
    console.error("Erro ao enviar o email: ", error.message);
    return false;
  }

  /*if (check) {
    return true;
  } else {
    return false;
  }*/
};

const randomCode = (max = 5) => {
  const letters = "abcdefghijklmnopqrstuvwxyz0123456789";

  let code = "";

  for (let i = 0; i < max; i++) {
    const math = Math.floor(Math.random() * letters.length);
    code += letters.charAt(math);
  }

  return code;
};

module.exports = {
  emailTransporter,
  randomCode,
};
