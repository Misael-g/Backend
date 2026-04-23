import sendMail from '../config/nodemailer.js'


const sendMailToRegister = (userMail, token) => {
    return sendMail(
        userMail,
        'Confirma tu cuenta en UniBooks ',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a3c6e;">¡Bienvenido a UniBooks!</h1>
            <p>Gracias por registrarte. Por favor confirma tu cuenta haciendo clic en el siguiente botón:</p>
            <a 
                href="${process.env.URL_BACKEND}api/confirmar/${token}"
                style="
                    display: inline-block;
                    background-color: #1a3c6e;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 16px 0;
                "
            >
                Confirmar cuenta
            </a>
            <p style="color: #666; font-size: 14px;">
                Si no te registraste en UniBooks, puedes ignorar este correo.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <footer style="color: #999; font-size: 12px;">
                El equipo de UniBooks — Escuela Politécnica Nacional
            </footer>
        </div>
        `
    )
}

export { sendMailToRegister }