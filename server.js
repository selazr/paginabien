const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const ARCHIVO = 'suscriptores.json';

const app = express();

app.use(cors());
app.use(bodyParser.json())

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ivantaranilla15@gmail.com',
        pass: ''
    }
});

app.post('/api/newsletter/subscribe', async (req, res) => {
    const { email, website } = req.body;

    if (website) return res.json({ ok: true });

    if (!email) {
        return res.status(400).json({ error: 'El email es obligatorio' });
    }

    if (!email) {
        return res.status(400).json({ error: 'El email es obligatorio' });
    }

    let lista = [];
    if (fs.existsSync(ARCHIVO)) {
        lista = JSON.parse(fs.readFileSync(ARCHIVO, 'utf8'));
    }

    // Evitar duplicados
    if (!lista.includes(email)) {
        lista.push(email);
        fs.writeFileSync(ARCHIVO, JSON.stringify(lista, null, 2));
    }

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Bienvenido al newsletter',
            html: '<p>Gracias por suscribirte. Pronto recibirás novedades</p>'
        });
        res.json({ ok: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al enviar el email' });
    }
});
app.listen(3002, () => console.log('Servidor en http://localhost:3002'));