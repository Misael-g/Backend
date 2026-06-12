import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP
    }
})



const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"UniBooks" <admin@unibooks.com>',
            to,
            subject,
            html
        })
        console.log('Email enviado:', info.messageId)
    } catch (error) {
        console.error('Error enviando email:', error.message)
        throw error
    }
}

export default sendMail
