import { BrevoClient } from '@getbrevo/brevo'
import dotenv from 'dotenv'
dotenv.config()

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY })

const sendMail = async (to, subject, html) => {
    try {
        const data = await brevo.transactionalEmails.sendTransacEmail({
            sender: { name: 'UniBooks', email: process.env.USER_MAILTRAP }, // tu correo verificado en Brevo
            to: [{ email: to }],
            subject,
            htmlContent: html
        })

        console.log('Email enviado:', data)
        return data
    } catch (error) {
        console.error('Error enviando email:', error.message)
        throw error
    }
}

export default sendMail