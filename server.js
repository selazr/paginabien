const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/linex';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Conexion a MongoDB local
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB local (linex)'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

// Esquema de suscriptor
const suscriptorSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    token: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now }
});

const Suscriptor = mongoose.model('Suscriptor', suscriptorSchema);

// Middlewares
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));

app.use(express.json());

// Configuracion de correo
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API newsletter funcionando');
});

// Suscripcion al newsletter
app.post('/api/newsletter/subscribe', async (req, res) => {
    const { email, website } = req.body;

    // Honeypot anti bots
    if (website) {
        return res.json({ ok: true });
    }

    if (!email) {
        return res.status(400).json({ error: 'El email es obligatorio' });
    }

    try {
        const emailLimpio = String(email).trim().toLowerCase();

        const existe = await Suscriptor.findOne({ email: emailLimpio });
        if (existe) {
            return res.status(400).json({ error: 'Este email ya esta suscrito' });
        }

        const token = crypto.randomUUID();

        await Suscriptor.create({
            email: emailLimpio,
            token
        });

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: emailLimpio,
            subject: 'Bienvenido al newsletter de Line-X',
            html: `
                <p>Gracias por suscribirte. Pronto recibiras novedades.</p>
                <hr>
                <p style="font-size:12px;color:#999;">
                    Si deseas darte de baja,
                    <a href="${FRONTEND_URL}/index.html?token=${token}">haz clic aqui</a>.
                </p>
            `
        });

        return res.json({ ok: true });

    } catch (error) {
        console.error('Error en suscripcion:', error);
        return res.status(500).json({ error: 'Error al procesar la suscripcion' });
    }
});

// Baja automatica por token
app.get('/api/newsletter/unsubscribe', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: 'Token invalido' });
    }

    try {
        const suscriptor = await Suscriptor.findOne({ token });

        if (!suscriptor) {
            return res.status(404).json({ error: 'Token no encontrado' });
        }

        const emailBaja = suscriptor.email;

        await Suscriptor.deleteOne({ token });

        // Respondemos primero
        res.status(200).json({ ok: true });

        // Luego intentamos enviar email de confirmacion
        try {
            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: emailBaja,
                subject: 'Hasta pronto - Line-X',
                html: `
                    <p>Hemos procesado tu solicitud de baja correctamente.</p>
                    <p>Si cambias de opinion, siempre puedes volver a suscribirte en nuestra <a href="${FRONTEND_URL}">web</a>.</p>
                `
            });
        } catch (mailError) {
            console.error('Error enviando email de confirmacion de baja:', mailError);
        }

    } catch (error) {
        console.error('Error en baja por token:', error);

        if (!res.headersSent) {
            return res.status(500).json({ error: 'Error al procesar la baja' });
        }
    }
});

// Baja manual por email
app.post('/api/newsletter/unsubscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'El email es obligatorio' });
    }

    try {
        const emailLimpio = String(email).trim().toLowerCase();

        const existe = await Suscriptor.findOne({ email: emailLimpio });

        if (!existe) {
            return res.status(400).json({ error: 'Este email no esta suscrito' });
        }

        await Suscriptor.deleteOne({ email: emailLimpio });

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: emailLimpio,
            subject: 'Hasta pronto - Line-X',
            html: `
                <p>Hemos procesado tu solicitud de baja correctamente.</p>
                <p>Si cambias de opinion, siempre puedes volver a suscribirte en nuestra <a href="${FRONTEND_URL}">web</a>.</p>
            `
        });

        return res.json({ ok: true });

    } catch (error) {
        console.error('Error en baja manual:', error);
        return res.status(500).json({ error: 'Error al procesar la baja' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});