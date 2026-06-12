import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import dotenv from 'dotenv'
dotenv.config()

const OAuth2 = google.auth.OAuth2

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
    )

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    })

    const accessToken = await oauth2Client.getAccessToken()

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.USER_MAILTRAP,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: accessToken.token
        }
    })
}

const sendMail = async (to, subject, html) => {
    try {
        const transporter = await createTransporter()
        const info = await transporter.sendMail({
            from: '"UniBooks" <unibooks08@gmail.com>',
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