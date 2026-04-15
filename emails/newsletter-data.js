const currentYear = new Date().getFullYear();

module.exports = {
    defaultLanguage: 'es',
    supportedLanguages: ['es', 'ca', 'en'],
    welcome: {
        es: {
            editionLabel: `Newsletter - ${currentYear}`,
            badgeLabel: `Edicion especial ${currentYear}`,
            heroTitleTop: 'Damos vida',
            heroTitleBottom: 'a tus ideas',
            heroText: 'Gracias por unirte al newsletter de Line-X Hispania. Aqui tienes una seleccion de proyectos recientes y novedades del estudio para que conozcas mejor lo que hacemos.',
            heroCtaUrl: 'https://lxh.es/proyectos.html',
            heroCtaLabel: 'Ver todos los proyectos',
            stats: [
                { value: '250+', label: 'Proyectos' },
                { value: '19', label: 'Anos' },
                { value: '100+', label: 'Clientes' }
            ],
            sectionProjects: 'Proyectos recientes',
            sectionUpdates: 'Novedades',
            projects: [
                {
                    category: 'Figuras',
                    title: 'Garzas Iberostar',
                    text: 'Piezas escultoricas creadas con un acabado artesanal muy cuidado para reforzar la identidad visual del espacio.',
                    url: 'https://lxh.es/garzas.html',
                    image: 'https://lxh.es/assets/images/portfolio/garza-1200-865.jpg',
                    ctaLabel: 'Ver proyecto'
                },
                {
                    category: 'Tematizacion',
                    title: 'Moon',
                    text: 'Una propuesta inmersiva donde combinamos volumen, pintura y detalle para construir una escena con atmosfera propia.',
                    url: 'https://lxh.es/moon.html',
                    image: 'https://lxh.es/assets/images/portfolio/moon.jpeg',
                    ctaLabel: 'Descubrir'
                },
                {
                    category: 'Instalaciones',
                    title: 'Royal Caribbean',
                    text: 'Desarrollo de elementos tematicos pensados para alto impacto visual y durabilidad en espacios de gran transito.',
                    url: 'https://lxh.es/RoyalCaribean.html',
                    image: 'https://lxh.es/assets/images/portfolio/RoyalCaribean.jpg',
                    ctaLabel: 'Ver trabajo'
                }
            ],
            updates: [
                {
                    title: 'Nuevos proyectos destacados',
                    text: 'Estamos incorporando piezas y espacios tematicos recientes para que puedas ver mejor el nivel de detalle y acabados de cada trabajo.'
                },
                {
                    title: 'Procesos de produccion propios',
                    text: 'Desde modelado y talla hasta pintura, fibra e impresion 3D, concentramos gran parte del proceso en nuestros propios talleres.'
                },
                {
                    title: 'Mas contenido util',
                    text: 'Queremos que este primer correo te sirva como punto de partida para explorar proyectos, tecnicas y novedades sin perderte nada importante.'
                }
            ],
            footerText: 'Este es tu primer correo del newsletter. A partir de aqui podemos reutilizar esta misma plantilla para futuras novedades y campanas.',
            unsubscribeText: 'Si prefieres dejar de recibir estos mensajes,',
            unsubscribeLinkLabel: 'puedes darte de baja aqui',
            subject: 'Bienvenido al newsletter de Line-X Hispania'
        },
        ca: {
            editionLabel: `Newsletter - ${currentYear}`,
            badgeLabel: `Edicio especial ${currentYear}`,
            heroTitleTop: 'Donem vida',
            heroTitleBottom: 'a les teves idees',
            heroText: "Gracies per unir-te al newsletter de Line-X Hispania. Aqui tens una seleccio de projectes recents i novetats de l'estudi perque coneguis millor el que fem.",
            heroCtaUrl: 'https://lxh.es/proyectos.html',
            heroCtaLabel: 'Veure tots els projectes',
            stats: [
                { value: '250+', label: 'Projectes' },
                { value: '19', label: 'Anys' },
                { value: '100+', label: 'Clients' }
            ],
            sectionProjects: 'Projectes recents',
            sectionUpdates: 'Novetats',
            projects: [
                {
                    category: 'Figures',
                    title: 'Garzas Iberostar',
                    text: "Peces escultoriques creades amb un acabat artesanal molt cuidat per reforcar la identitat visual de l'espai.",
                    url: 'https://lxh.es/garzas.html',
                    image: 'https://lxh.es/assets/images/portfolio/garza-1200-865.jpg',
                    ctaLabel: 'Veure projecte'
                },
                {
                    category: 'Tematitzacio',
                    title: 'Moon',
                    text: 'Una proposta immersiva on combinem volum, pintura i detall per construir una escena amb atmosfera propia.',
                    url: 'https://lxh.es/moon.html',
                    image: 'https://lxh.es/assets/images/portfolio/moon.jpeg',
                    ctaLabel: 'Descobrir'
                },
                {
                    category: 'Instal.lacions',
                    title: 'Royal Caribbean',
                    text: 'Desenvolupament d elements tematics pensats per a alt impacte visual i durabilitat en espais de gran transit.',
                    url: 'https://lxh.es/RoyalCaribean.html',
                    image: 'https://lxh.es/assets/images/portfolio/RoyalCaribean.jpg',
                    ctaLabel: 'Veure feina'
                }
            ],
            updates: [
                {
                    title: 'Nous projectes destacats',
                    text: 'Estem incorporant peces i espais tematics recents perque puguis veure millor el nivell de detall i acabats de cada treball.'
                },
                {
                    title: 'Processos de produccio propis',
                    text: 'Des de modelatge i talla fins a pintura, fibra i impressio 3D, concentrem gran part del proces als nostres propis tallers.'
                },
                {
                    title: 'Mes contingut util',
                    text: 'Volem que aquest primer correu et serveixi com a punt de partida per explorar projectes, tecniques i novetats sense perdre res important.'
                }
            ],
            footerText: 'Aquest es el teu primer correu del newsletter. A partir d aqui podem reutilitzar aquesta mateixa plantilla per a futures novetats i campanyes.',
            unsubscribeText: 'Si prefereixes deixar de rebre aquests missatges,',
            unsubscribeLinkLabel: 'pots donar-te de baixa aqui',
            subject: 'Benvingut al newsletter de Line-X Hispania'
        },
        en: {
            editionLabel: `Newsletter - ${currentYear}`,
            badgeLabel: `Special edition ${currentYear}`,
            heroTitleTop: 'We bring',
            heroTitleBottom: 'your ideas to life',
            heroText: 'Thanks for joining the Line-X Hispania newsletter. Here is a selection of recent projects and studio updates so you can quickly see what we do best.',
            heroCtaUrl: 'https://lxh.es/proyectos.html',
            heroCtaLabel: 'View all projects',
            stats: [
                { value: '250+', label: 'Projects' },
                { value: '19', label: 'Years' },
                { value: '100+', label: 'Clients' }
            ],
            sectionProjects: 'Recent projects',
            sectionUpdates: 'Updates',
            projects: [
                {
                    category: 'Figures',
                    title: 'Garzas Iberostar',
                    text: 'Sculptural pieces built with a careful handcrafted finish to strengthen the visual identity of the space.',
                    url: 'https://lxh.es/garzas.html',
                    image: 'https://lxh.es/assets/images/portfolio/garza-1200-865.jpg',
                    ctaLabel: 'View project'
                },
                {
                    category: 'Theming',
                    title: 'Moon',
                    text: 'An immersive concept where we combine volume, paint and detail to create a scene with its own atmosphere.',
                    url: 'https://lxh.es/moon.html',
                    image: 'https://lxh.es/assets/images/portfolio/moon.jpeg',
                    ctaLabel: 'Discover'
                },
                {
                    category: 'Installations',
                    title: 'Royal Caribbean',
                    text: 'Thematic elements designed for strong visual impact and long-term durability in high-traffic environments.',
                    url: 'https://lxh.es/RoyalCaribean.html',
                    image: 'https://lxh.es/assets/images/portfolio/RoyalCaribean.jpg',
                    ctaLabel: 'View work'
                }
            ],
            updates: [
                {
                    title: 'New featured projects',
                    text: 'We are adding recent pieces and themed spaces so you can better see the level of detail and finishing in each project.'
                },
                {
                    title: 'In-house production processes',
                    text: 'From modeling and carving to paint, fiberglass and 3D printing, a large part of the process happens inside our own workshops.'
                },
                {
                    title: 'More useful content',
                    text: 'We want this first email to be a practical starting point for exploring projects, techniques and updates without missing anything important.'
                }
            ],
            footerText: 'This is your first newsletter email. From here we can reuse the same template for future updates and campaigns.',
            unsubscribeText: 'If you would rather stop receiving these messages,',
            unsubscribeLinkLabel: 'you can unsubscribe here',
            subject: 'Welcome to the Line-X Hispania newsletter'
        }
    },
    unsubscribe: {
        es: {
            subject: 'Hasta pronto - Line-X Hispania',
            title: 'Tu baja ha sido procesada',
            body: 'Hemos procesado tu solicitud de baja correctamente. Si cambias de opinion, siempre puedes volver a suscribirte desde nuestra web.',
            ctaLabel: 'Volver a la web',
            footer: 'Gracias por haber formado parte del newsletter de Line-X Hispania.'
        },
        ca: {
            subject: 'Fins aviat - Line-X Hispania',
            title: 'La teva baixa ha estat processada',
            body: "Hem processat correctament la teva sollicitud de baixa. Si canvies d opinio, sempre et pots tornar a subscriure des del nostre web.",
            ctaLabel: 'Tornar al web',
            footer: 'Gracies per haver format part del newsletter de Line-X Hispania.'
        },
        en: {
            subject: 'See you soon - Line-X Hispania',
            title: 'Your unsubscribe request has been completed',
            body: 'We have processed your unsubscribe request successfully. If you change your mind, you can always subscribe again from our website.',
            ctaLabel: 'Back to the website',
            footer: 'Thanks for being part of the Line-X Hispania newsletter.'
        }
    }
};
