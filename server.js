const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();
const newsletterData = require('./emails/newsletter-data');

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
    language: { type: String, default: newsletterData.defaultLanguage },
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

const welcomeTemplatePath = path.join(__dirname, 'emails', 'newsletter-welcome.html');
const unsubscribeTemplatePath = path.join(__dirname, 'emails', 'newsletter-unsubscribe.html');

function normalizeLanguage(lang) {
    return newsletterData.supportedLanguages.includes(lang) ? lang : newsletterData.defaultLanguage;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function buildProjectCards(projects) {
    return projects.map((project) => `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#111111;border:1px solid #1e1e1e;border-radius:16px;margin-bottom:16px;overflow:hidden;">
          <tr>
            <td style="padding:0;line-height:0;">
              <a href="${escapeHtml(project.url)}" style="display:block;">
                <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" width="552" style="width:100%;height:auto;display:block;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 22px;border-top:1px solid #1e1e1e;border-bottom:1px solid #1e1e1e;background:#141414;">
              <span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#666666;">${escapeHtml(project.category)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 24px 26px;">
              <h3 style="margin:0 0 10px;font-size:20px;line-height:1.3;color:#efefef;">${escapeHtml(project.title)}</h3>
              <p style="margin:0 0 20px;color:#8a8a8a;font-size:14px;line-height:1.75;">${escapeHtml(project.text)}</p>
              <a href="${escapeHtml(project.url)}" style="display:inline-block;padding:11px 18px;border-radius:999px;border:1px solid #2a2a2a;background:#191919;color:#d8d8d8;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">${escapeHtml(project.ctaLabel)}</a>
            </td>
          </tr>
        </table>
    `).join('');
}

function buildUpdates(updates) {
    return updates.map((update) => `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;background:#121212;border:1px solid #202020;border-radius:14px;">
          <tr>
            <td style="padding:18px 20px;">
              <h3 style="margin:0 0 8px;font-size:16px;color:#f2f2f2;">${escapeHtml(update.title)}</h3>
              <p style="margin:0;color:#878787;font-size:14px;line-height:1.7;">${escapeHtml(update.text)}</p>
            </td>
          </tr>
        </table>
    `).join('');
}

async function renderWelcomeEmail({ token, lang }) {
    const template = await fs.readFile(welcomeTemplatePath, 'utf8');
    const copy = newsletterData.welcome[normalizeLanguage(lang)];
    const unsubscribeUrl = `${FRONTEND_URL}/index.html?token=${token}`;
    const replacements = {
        '{{EDITION_LABEL}}': copy.editionLabel,
        '{{BADGE_LABEL}}': copy.badgeLabel,
        '{{HERO_TITLE_TOP}}': copy.heroTitleTop,
        '{{HERO_TITLE_BOTTOM}}': copy.heroTitleBottom,
        '{{HERO_TEXT}}': copy.heroText,
        '{{HERO_CTA_URL}}': copy.heroCtaUrl,
        '{{HERO_CTA_LABEL}}': copy.heroCtaLabel,
        '{{STAT_1_VALUE}}': copy.stats[0].value,
        '{{STAT_1_LABEL}}': copy.stats[0].label,
        '{{STAT_2_VALUE}}': copy.stats[1].value,
        '{{STAT_2_LABEL}}': copy.stats[1].label,
        '{{STAT_3_VALUE}}': copy.stats[2].value,
        '{{STAT_3_LABEL}}': copy.stats[2].label,
        '{{PROJECTS_SECTION_LABEL}}': copy.sectionProjects,
        '{{UPDATES_SECTION_LABEL}}': copy.sectionUpdates,
        '{{PROJECTS_HTML}}': buildProjectCards(copy.projects),
        '{{UPDATES_HTML}}': buildUpdates(copy.updates),
        '{{FOOTER_TEXT}}': copy.footerText,
        '{{UNSUBSCRIBE_TEXT}}': copy.unsubscribeText,
        '{{UNSUBSCRIBE_LINK_LABEL}}': copy.unsubscribeLinkLabel,
        '{{UNSUBSCRIBE_URL}}': unsubscribeUrl
    };

    return Object.entries(replacements).reduce(
        (html, [key, value]) => html.replaceAll(key, value),
        template
    );
}

async function renderUnsubscribeEmail({ lang }) {
    const template = await fs.readFile(unsubscribeTemplatePath, 'utf8');
    const copy = newsletterData.unsubscribe[normalizeLanguage(lang)];
    const replacements = {
        '{{SUBJECT}}': copy.subject,
        '{{TITLE}}': copy.title,
        '{{BODY}}': copy.body,
        '{{CTA_LABEL}}': copy.ctaLabel,
        '{{FOOTER}}': copy.footer,
        '{{HOME_URL}}': FRONTEND_URL
    };

    return Object.entries(replacements).reduce(
        (html, [key, value]) => html.replaceAll(key, value),
        template
    );
}
// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API newsletter funcionando');
});

// Suscripcion al newsletter
app.post('/api/newsletter/subscribe', async (req, res) => {
    const { email, website, lang } = req.body;

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
        const language = normalizeLanguage(String(lang || '').trim().toLowerCase());
        const welcomeHtml = await renderWelcomeEmail({ token, lang: language });

        await Suscriptor.create({
            email: emailLimpio,
            token,
            language
        });

        try {
            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: emailLimpio,
                subject: newsletterData.welcome[language].subject,
                html: welcomeHtml
            });
        } catch (mailError) {
            await Suscriptor.deleteOne({ token });
            throw mailError;
        }

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
        const language = normalizeLanguage(suscriptor.language);
        const unsubscribeHtml = await renderUnsubscribeEmail({ lang: language });

        await Suscriptor.deleteOne({ token });

        // Respondemos primero
        res.status(200).json({ ok: true });

        // Luego intentamos enviar email de confirmacion
        try {
            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: emailBaja,
                subject: newsletterData.unsubscribe[language].subject,
                html: unsubscribeHtml
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

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
