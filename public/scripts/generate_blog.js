const fs = require('fs');
const path = require('path');

const AI_ENDPOINT = "https://script.google.com/macros/s/AKfycbwJKtkMCOV8nDh3J5ngXzmU39xiB9zXbs6zFm5bTV1rlo6WKzm_XZXFFOzgEjEuIKF-/exec";
const APP_TOKEN = "Clinera_Internal_Secure_Key_2026";

function createSlug(title) {
    if (!title) return 'articulo';
    return title.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dash
        .replace(/(^-|-$)/g, ''); // remove leading/trailing dashes
}

async function generateBlogPosts() {
    console.log("🚀 Iniciando generación de blog estático...");

    try {
        const response = await fetch(AI_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({ type: 'get_blogs', token: APP_TOKEN })
        });

        if (!response.ok) {
            throw new Error(`Error al conectar con la API: ${response.statusText}`);
        }

        const blogs = await response.json();
        console.log(`✅ Se encontraron ${blogs.length} artículos.`);

        const outputDir = path.join(__dirname, '..', 'blog');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        blogs.forEach((post, index) => {
            const slug = createSlug(post.title);
            const fileName = `${slug}.html`;
            const filePath = path.join(outputDir, fileName);

            const html = generateHTML(post);
            fs.writeFileSync(filePath, html);
            console.log(`   📄 Generado: ${fileName}`);
        });

        console.log("\n✨ ¡Proceso completado! Los archivos están en la carpeta 'web 2.0/blog/'");

    } catch (error) {
        console.error("❌ Error durante la generación:", error);
    }
}

function autoFormatContent(text) {
    if (!text) return "";

    // Fix internal links inside the content using absolute root paths
    let formatted = text.replace(/href="(?!http|https|#|\/)(.*?)"/g, 'href="../$1"');

    if (formatted.includes('<p>') || formatted.includes('</div>') || formatted.includes('<br>')) return formatted;

    formatted = formatted.replace(/^## (.*$)/gm, '<h2 style="font-size:1.8rem; margin-top:3rem; color:var(--text-main); font-weight:800;">$1</h2>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<strong style="color:var(--text-main); font-weight:600;">$1</strong>');

    return formatted.split('\n\n').map(p => {
        if (p.trim().startsWith('<h2')) return p;
        return `<p style="margin-bottom:1.8rem; line-height:1.8;">${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');
}

function generateHTML(post) {
    const richContent = autoFormatContent(post.full_content || post.excerpt);

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} | Blog Clinera</title>
    <meta name="description" content="${(post.excerpt || post.title).replace(/"/g, '&quot;')}">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Local CSS (Volvemos un nivel arriba para alcanzar las carpetas base) -->
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/home.css">
    <link rel="icon" type="image/png" href="../favicon.png">

    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .blog-post-view { padding-top: 140px; padding-bottom: 100px; background: var(--bg-base); }
        .post-header { max-width: 1100px; margin: 0 auto 4rem; display: flex; align-items: center; gap: 4rem; text-align: left; }
        .post-header-content { flex: 1; }
        .post-header-image { flex: 1; max-width: 500px; }
        .post-category { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--brand-cyan); margin-bottom: 1.5rem; display: inline-block; background: rgba(6, 182, 212, 0.08); padding: 6px 16px; border-radius: 4px; }
        .post-title { font-size: 2.8rem; line-height: 1.2; font-weight: 800; color: var(--text-main); margin-bottom: 1.5rem; }
        .post-meta { font-size: 1rem; color: var(--text-secondary); display: flex; align-items: center; gap: 12px; }
        .post-author-img { width: 32px; height: 32px; border-radius: 50%; background: var(--brand-cyan); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem; font-weight: 700; }
        .post-main-image { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 12px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
        .post-content { max-width: 750px; margin: 0 auto; font-size: 1.15rem; line-height: 1.8; color: var(--text-secondary); }
        .post-content h2, .post-content h3 { color: var(--text-main); margin: 2.5rem 0 1rem; font-weight: 700; }
        .post-content p { margin-bottom: 1.5rem; }
        .post-content img { max-width: 100%; border-radius: 12px; margin: 2rem 0; box-shadow: var(--shadow-md); }
        
        @media (max-width: 991px) {
            .post-header { flex-direction: column; text-align: center; gap: 2rem; }
            .post-header-image { max-width: 100%; }
            .post-title { font-size: 2.25rem !important; }
            .post-meta { justify-content: center; }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <script src="../js/components.js?v=9.0"></script>
    <clinera-header base="../"></clinera-header>

    <main class="blog-post-view">
        <div class="container">
            <article>
                <div class="post-header">
                    <div class="post-header-content">
                        <span class="post-category">${post.category || 'Novedades'}</span>
                        <h1 class="post-title">${post.title}</h1>
                        <div class="post-meta">
                            <div class="post-author-img">C</div>
                            <span>Escrito por: <strong>Team Clinera</strong></span>
                        </div>
                    </div>
                    <div class="post-header-image">
                        ${post.image ? `<img src="${post.image}" class="post-main-image" alt="${post.title}">` : ''}
                    </div>
                </div>
                
                <div class="post-content">
                    <p style="color:var(--text-muted); font-size:1.2rem; line-height:1.6; margin-bottom:2.5rem; font-style: italic; border-left: 4px solid var(--brand-cyan); padding-left: 1.5rem;">
                        ${post.excerpt || ''}
                    </p>
                    ${richContent}
                </div>
                
                <div style="margin-top: 6rem; text-align:center; border-top: 1px solid rgba(0,0,0,0.05); padding: 4rem 2rem;">
                    <h2 style="margin-bottom: 0.5rem; font-weight:800; font-size:1.8rem;">¿Te fue útil este artículo?</h2>
                    <p style="margin-bottom: 2.5rem; color:var(--text-secondary); font-size:1.1rem;">Si tienes más dudas, puedes explorar otros temas o contactar a soporte.</p>
                    <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
                        <a href="../ayuda.html" class="btn" style="background:#f4f4f5; color:var(--text-main); padding: 14px 30px; border-radius:50px; font-weight:600;">Volver a Ayuda</a>
                        <a href="https://wa.me/56985581524" class="btn btn-primary" style="padding: 14px 30px; border-radius:50px; box-shadow: 0 4px 15px rgba(6,182,212,0.2);">Hablar con Soporte</a>
                    </div>
                </div>
            </article>
        </div>
    </main>
</body>
</html>`;
}

generateBlogPosts();
