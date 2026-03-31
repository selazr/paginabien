const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

// ── Añadido: token y fecha ──────────────────────────────────
const suscriptorSchema = new mongoose.Schema({
    email:         { type: String, required: true, unique: true },
    token:         { type: String, required: true, unique: true },
    subscribedAt:  { type: Date, default: Date.now }
});

const Suscriptor = mongoose.model('Suscriptor', suscriptorSchema);

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

app.post('/api/newsletter/subscribe', async (req, res) => {
    const { email, website } = req.body;

    if (website) return res.json({ ok: true });

    if (!email) {
        return res.status(400).json({ error: 'El email es obligatorio' });
    }

    try {
        const existe = await Suscriptor.findOne({ email });
        if (existe) {
            return res.status(400).json({ error: 'Este email ya está suscrito' });
        }

        // ── Añadido: generar token único ───────────────────
        const token = crypto.randomUUID();
        await Suscriptor.create({ email, token });

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Bienvenido al newsletter de Line-X',
            // ── Añadido: link de baja en el email ─────────
            html: `
                <p>Gracias por suscribirte. Pronto recibirás novedades.</p>
                <hr>
                <p style="font-size:12px;color:#999;">
                    Si deseas darte de baja,
                    <a href="${process.env.FRONTEND_URL}/index.html?token=${token}">haz clic aquí</a>.
                </p>
            `
        });

        res.json({ ok: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la suscripción' });
    }
});

// ── Añadido: baja automática por token (desde el link del email) ──
app.get('/api/newsletter/unsubscribe', async (req, res) => {
    const { token } = req.query;

    if (!token) return res.status(400).json({ error: 'Token inválido.' });

    try {
        const suscriptor = await Suscriptor.findOne({ token });
        if (!suscriptor) return res.status(404).json({ error: 'Token no encontrado.' });

        const emailBaja = suscriptor.email;
        await Suscriptor.deleteOne({ token });

        res.status(200).json({ ok: true });

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: emailBaja,
            subject: 'Hasta pronto - Line-X',
            html: `
                <p>Hemos procesado tu solicitud de baja correctamente.</p>
                <p>Si cambias de opinión, siempre puedes volver a suscribirte en nuestra <a href="${process.env.FRONTEND_URL}">web</a>.</p>
            `
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la baja' });
    }
});

app.post('/api/newsletter/unsubscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'El email es obligatorio' });
    }

    try {
        const existe = await Suscriptor.findOne({ email });
        if (!existe) {
            return res.status(400).json({ error: 'Este email no está suscrito' });
        }

        await Suscriptor.deleteOne({ email });

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Hasta pronto - Line-X',
            html: `
                <p>Hemos procesado tu solicitud de baja correctamente.</p>
                <p>Si cambias de opinión, siempre puedes volver a suscribirte en nuestra <a href="${process.env.FRONTEND_URL}">web</a>.</p>
            `
        });

        res.json({ ok: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la baja' });
    }
});

app.listen(3002, () => console.log('Servidor en http://localhost:3002'));