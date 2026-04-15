/* 
   CLINERA HELP CENTER - CORE LOGIC
   Shared pattern with /support modules
*/

const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwJKtkMCOV8nDh3J5ngXzmU39xiB9zXbs6zFm5bTV1rlo6WKzm_XZXFFOzgEjEuIKF-/exec';
const API_KEY = 'Clinera_Internal_Secure_Key_2026';

let allTutorials = [];
let allFaqs = [];
let allBlogs = [];
let searchMode = false;

// Helper para convertir títulos en nombres de archivo (slugs)
function slugify(text) {
    if (!text) return "";
    return text.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar acentos
        .replace(/\s+/g, '-')           // Espacios por guiones
        .replace(/[^\w\-]+/g, '')       // Quitar caracteres no válidos
        .replace(/\-\-+/g, '-')         // Unir guiones múltiples
        .replace(/^-+/, '')             // Quitar guiones al inicio
        .replace(/-+$/, '');            // Quitar guiones al final
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial UI Setup
    if (window.lucide) window.lucide.createIcons();

    // 2. FORCE CACHE RESET (Versioning)
    const CACHE_VERSION = "v5_static_files";
    const currentCacheVer = localStorage.getItem("clinera_kb_version");

    if (currentCacheVer !== CACHE_VERSION) {
        localStorage.removeItem("clinera_kb_data");
        localStorage.removeItem("clinera_kb_expiry");
        localStorage.setItem("clinera_kb_version", CACHE_VERSION);
    }

    // 3. Load from Cache (Immediate)
    const stored = localStorage.getItem("clinera_kb_data");
    const expiry = localStorage.getItem("clinera_kb_expiry");
    let hasCache = false;

    if (stored) {
        try {
            const cachedData = JSON.parse(stored);
            if (cachedData && (cachedData.tutorials || cachedData.faqs || cachedData.blogs)) {
                allTutorials = cachedData.tutorials || [];
                allFaqs = cachedData.faqs || [];
                allBlogs = cachedData.blogs || [];
                renderDashboard();
                hasCache = true;
            }
        } catch (e) {
            localStorage.removeItem("clinera_kb_data");
        }
    }

    // 4. Force Fetch
    loadKnowledgeBase();

    // Search listeners
    const mainSearch = document.getElementById('mainSearch');
    if (mainSearch) {
        mainSearch.addEventListener('input', (e) => {
            const term = e.target.value.trim().toLowerCase();
            if (term.length > 0) {
                if (!searchMode) activateSearchMode();
                performSearch(term);
            } else {
                exitSearchMode();
            }
        });
    }
});

async function loadKnowledgeBase() {
    try {
        const res = await fetch(API_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({ type: 'get_all_help_data', token: API_KEY })
        });

        if (res.ok) {
            const data = await res.json();
            const hasData = data && (
                (data.tutorials && data.tutorials.length > 0) ||
                (data.faqs && data.faqs.length > 0) ||
                (data.blogs && data.blogs.length > 0)
            );

            if (hasData) {
                allTutorials = data.tutorials || [];
                allFaqs = data.faqs || [];
                allBlogs = data.blogs || [];
                localStorage.setItem("clinera_kb_data", JSON.stringify(data));
                localStorage.setItem("clinera_kb_expiry", (new Date().getTime() + 2 * 60 * 60 * 1000).toString());
                renderDashboard();
                const searchInput = document.getElementById('mainSearch');
                if (searchMode && searchInput) performSearch(searchInput.value);
            }
        }
    } catch (error) {
        console.error("Error loading knowledge base:", error);
    }
}

function renderDashboard() {
    const randomSeed = Math.floor(Math.random() * 10000);

    // 1. Featured
    const featContainer = document.getElementById('featuredContainer');
    if (allTutorials.length > 0) {
        const featIndex = getSeededIndex(allTutorials, randomSeed);
        const featured = allTutorials[featIndex];
        const vInfo = getVideoInfo(featured.videoUrl);
        let thumb = featured.thumbnail || getAutoThumbnail(vInfo);

        featContainer.innerHTML = `
            <div class="featured-main" onclick="openVideoModal('${vInfo.type}', '${vInfo.id}', '${featured.videoUrl}')">
                <img src="${thumb}" alt="Featured" onerror="this.src='favicon.png'">
                <div class="play-btn-large">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
                <div class="featured-content">
                    <span class="featured-tag">VIDEO DESTACADO · ${featured.duration || '--:--'}</span>
                    <h2 class="featured-title">${featured.title}</h2>
                </div>
            </div>`;
    }

    // 2. Sidebar FAQs
    const faqContainer = document.getElementById('popularFaqContainer');
    if (allFaqs.length > 0) {
        faqContainer.innerHTML = '';
        for (let i = 0; i < 2; i++) {
            const idx = (randomSeed + i) % allFaqs.length;
            const faq = allFaqs[idx];
            const iconRaw = faq.icon || 'help-circle';
            let iconHtml = iconRaw.length > 2 ? `<i data-lucide="${iconRaw}" style="width:18px; height:18px;"></i>` : iconRaw;

            faqContainer.innerHTML += `
                <div class="faq-item-small" onclick="showFaqDetail(${idx})">
                    <div class="faq-header">
                        <span class="faq-icon-s">${iconHtml}</span>
                        FAQ POPULAR
                    </div>
                    <h4>${faq.title}</h4>
                    <p>${faq.content}</p>
                </div>`;
        }
        faqContainer.innerHTML += `
            <a href="javascript:void(0)" onclick="activateSearchMode('faq')" class="view-all-link" style="text-align: right; margin-top: -0.5rem; display: block; padding-right: 1.5rem;">
                Ver todas →
            </a>`;
    }

    // 3. Popular Videos
    const popVideoContainer = document.getElementById('popularVideosContainer');
    if (allTutorials.length > 0) {
        popVideoContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const idx = (randomSeed + i + 2) % allTutorials.length;
            const video = allTutorials[idx];
            if (!video) continue;
            const vi = getVideoInfo(video.videoUrl);
            let vThumb = video.thumbnail || getAutoThumbnail(vi);

            popVideoContainer.innerHTML += `
                <div class="video-card" onclick="openVideoModal('${vi.type}', '${vi.id}', '${video.videoUrl}')">
                    <div class="video-thumb-container">
                        <img src="${vThumb}" alt="Thumbnail">
                        <div class="play-overlay">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                    </div>
                    <div class="video-info">
                        <span class="video-cat">${video.category || 'General'}</span>
                        <h4 class="video-title">${video.title}</h4>
                        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:8px;">⏱️ ${video.duration || ''}</p>
                    </div>
                </div>`;
        }
    }

    // 4. Knowledge Mixed Grid
    const mixedContainer = document.getElementById('knowledgeMixedContainer');
    if (mixedContainer) {
        mixedContainer.innerHTML = '';
        if (allBlogs.length > 0) {
            const bIdx = randomSeed % allBlogs.length;
            const b = allBlogs[bIdx];

            // Lógica Inteligente para Archivos Estáticos
            let cleanUrl = b.url ? b.url.trim() : "";
            if (!cleanUrl || cleanUrl === "#") {
                // Fallback: Generar el nombre del archivo desde el título
                cleanUrl = `/blog/${slugify(b.title)}.html`;
            } else if (!cleanUrl.startsWith('http') && !cleanUrl.startsWith('/')) {
                cleanUrl = '/blog/' + cleanUrl;
            }

            mixedContainer.innerHTML += `
                <a href="${cleanUrl}" class="card-kb">
                    <div class="card-kb-img"><img src="${b.image || 'images/marketing.webp'}" alt=""></div>
                    <div class="card-kb-content">
                        <span class="featured-tag">ARTÍCULO · ESTRATEGIA</span>
                        <h3>${b.title}</h3>
                        <p>${b.excerpt || ''}</p>
                    </div>
                </a>`;
        }
        const f1Idx = (randomSeed + 4) % (allFaqs.length || 1);
        if (allFaqs[f1Idx]) {
            mixedContainer.innerHTML += `
                <div class="card-kb card-kb-full" onclick="showFaqDetail(${f1Idx})" style="cursor:pointer">
                    <span class="featured-tag" style="background:#fff7ed; color:#ea580c;">ARTÍCULO · TECH</span>
                    <h3>${allFaqs[f1Idx].title}</h3>
                    <p>${allFaqs[f1Idx].content}</p>
                </div>`;
        }
        const f2Idx = (randomSeed + 12) % (allFaqs.length || 1);
        if (allFaqs[f2Idx]) {
            mixedContainer.innerHTML += `
                <div class="card-kb card-kb-full" style="background:#f0fdfa; cursor:pointer" onclick="showFaqDetail(${f2Idx})">
                    <div class="icon-box"><i data-lucide="info"></i></div>
                    <span class="featured-tag" style="background:white; color:var(--brand-cyan);">FAQ · SOPORTE</span>
                    <h3 style="color:#00767c;">${allFaqs[f2Idx].title}</h3>
                    <p style="color:#009a9e;">${allFaqs[f2Idx].content.substring(0, 60)}...</p>
                </div>`;
        }
        mixedContainer.innerHTML += `
            <div class="card-kb card-kb-dark">
                <span class="featured-tag">SOPORTE EN VIVO</span>
                <h3>¿No encuentras lo que buscas?</h3>
                <button class="btn-cuky" onclick="toggleCukyChat()">Hablar con Cuky 🐾</button>
            </div>`;
    }

    if (window.lucide) window.lucide.createIcons();
}

function activateSearchMode(tab = 'tutoriales') {
    searchMode = true;
    document.body.classList.add('search-active');
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('searchResultsView').style.display = 'block';

    const searchInput = document.getElementById('mainSearch');
    const term = searchInput ? searchInput.value.trim().toLowerCase() : '';
    performSearch(term);

    const btnIdx = tab === 'faq' ? 1 : tab === 'blog' ? 2 : 0;
    const tabs = document.querySelectorAll('.help-tab-btn');
    if (tabs[btnIdx]) switchResultsTab(tab, tabs[btnIdx]);
}

function exitSearchMode() {
    searchMode = false;
    document.body.classList.remove('search-active');
    document.getElementById('dashboardView').style.display = 'block';
    document.getElementById('searchResultsView').style.display = 'none';
    const searchInput = document.getElementById('mainSearch');
    if (searchInput) searchInput.value = '';
}

function switchResultsTab(tabId, btn) {
    document.querySelectorAll('.res-tab-content').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.help-tab-btn').forEach(b => b.classList.remove('active'));

    const target = document.getElementById('results-' + tabId);
    if (target) target.style.display = 'block';
    if (btn) btn.classList.add('active');

    const searchInput = document.getElementById('mainSearch');
    if (searchInput) performSearch(searchInput.value);
}

function performSearch(term) {
    const activeTab = document.querySelector('.help-tab-btn.active');
    const activeType = activeTab ? activeTab.getAttribute('onclick').match(/'([^']+)'/)[1] : 'tutoriales';

    if (activeType === 'tutoriales') {
        const filtered = allTutorials.filter(v => v.title.toLowerCase().includes(term) || (v.category && v.category.toLowerCase().includes(term)));
        renderResultsVideos(filtered);
    } else if (activeType === 'faq') {
        const filtered = allFaqs.filter(f => f.title.toLowerCase().includes(term) || f.content.toLowerCase().includes(term));
        renderResultsFaqs(filtered);
    } else if (activeType === 'blog') {
        const filtered = allBlogs.filter(b => b.title.toLowerCase().includes(term) || (b.excerpt && b.excerpt.toLowerCase().includes(term)));
        renderResultsBlogs(filtered);
    }
}

function renderResultsVideos(list) {
    const container = document.getElementById('resultsVideoContainer');
    container.innerHTML = '';
    list.forEach(v => {
        const vi = getVideoInfo(v.videoUrl);
        let thumb = v.thumbnail || getAutoThumbnail(vi);
        container.innerHTML += `
            <div class="video-card" onclick="openVideoModal('${vi.type}', '${vi.id}', '${v.videoUrl}')">
                <div class="video-thumb-container">
                    <img src="${thumb}" alt="Thumbnail">
                    <div class="play-overlay"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
                </div>
                <div class="video-info">
                    <span class="video-cat">${v.category || 'General'}</span>
                    <h4 class="video-title">${v.title}</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-top:8px;">⏱️ ${v.duration || ''}</p>
                </div>
            </div>`;
    });
}

function renderResultsFaqs(list) {
    const container = document.getElementById('resultsFaqContainer');
    container.innerHTML = '';
    list.forEach(faq => {
        const iconRaw = faq.icon || 'help-circle';
        let iconHtml = iconRaw.length > 2 ? `<i data-lucide="${iconRaw}"></i>` : iconRaw;
        const realIdx = allFaqs.indexOf(faq);
        container.innerHTML += `
            <div class="faq-card" onclick="showFaqDetail(${realIdx})" style="cursor:pointer">
                <div class="faq-icon">${iconHtml}</div>
                <div class="faq-content">
                    <h4>${faq.title}</h4>
                    <p>${faq.content}</p>
                </div>
            </div>`;
    });
    if (window.lucide) window.lucide.createIcons();
}

function renderResultsBlogs(list) {
    const container = document.getElementById('resultsBlogContainer');
    container.innerHTML = '';
    list.forEach(blog => {
        const bIdx = allBlogs.indexOf(blog);

        let cleanUrl = blog.url ? blog.url.trim() : "";
        if (!cleanUrl || cleanUrl === "#") {
            // Fallback: Generar el nombre del archivo desde el título
            cleanUrl = `/blog/${slugify(blog.title)}.html`;
        } else if (!cleanUrl.startsWith('http') && !cleanUrl.startsWith('/')) {
            cleanUrl = '/blog/' + cleanUrl;
        }

        container.innerHTML += `
            <div class="video-card" onclick="location.href='${cleanUrl}'">
                <div class="video-thumb-container" style="background:#f1f5f9; padding-top:45%;">
                    <img src="${blog.image || 'images/marketing.webp'}" alt="Blog" style="opacity: 1;">
                </div>
                <div class="video-info">
                    <span class="video-cat">${blog.category || 'Lanzamiento'}</span>
                    <h4 class="video-title" style="margin-bottom:12px;">${blog.title}</h4>
                    <p style="font-size:0.9rem; color:var(--text-secondary);">${blog.excerpt || ''}</p>
                </div>
            </div>`;
    });
}

function showFaqDetail(idx) {
    const faq = allFaqs[idx];
    if (!faq) return;
    const container = document.getElementById('faqModalContent');
    const iconRaw = faq.icon || 'help-circle';
    let iconHtml = iconRaw.length > 2 ? `<i data-lucide="${iconRaw}" style="width:24px; height:24px;"></i>` : iconRaw;

    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px; color:var(--brand-cyan); margin-bottom:1.5rem; font-size:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:1px;">
            ${iconHtml}
            <span>Pregunta Frecuente</span>
        </div>
        <h2 style="font-size:2rem; font-weight:800; color:var(--text-main); margin-bottom:1.5rem; line-height:1.2;">${faq.title}</h2>
        <div style="font-size:1.1rem; color:var(--text-secondary); line-height:1.7;">
            ${faq.content.replace(/\n/g, '<br>')}
        </div>
        <div style="margin-top:2.5rem; padding-top:2rem; border-top:1px solid var(--border-light); display:flex; justify-content:flex-end;">
             <button onclick="closeFaqModal()" class="btn btn-primary" style="padding:10px 30px; border-radius:50px;">Entendido</button>
        </div>`;
    document.getElementById('faqModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
}

function closeFaqModal() {
    document.getElementById('faqModal').classList.remove('active');
    document.body.style.overflow = '';
}

// --- Video Helpers ---
function openVideoModal(type, id, url) {
    const modal = document.getElementById('videoModal');
    const container = document.getElementById('videoFrameContainer');
    let src = url;
    if (type === 'youtube') src = `https://www.youtube.com/embed/${id}?autoplay=1`;
    else if (type === 'vimeo') src = `https://player.vimeo.com/video/${id}?autoplay=1`;
    container.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    document.getElementById('videoFrameContainer').innerHTML = '';
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function getVideoInfo(url) {
    if (!url) return { type: null, id: null };
    const ytMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    if (ytMatch && ytMatch[2].length === 11) return { type: 'youtube', id: ytMatch[2] };
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
    if (vimeoMatch) return { type: 'vimeo', id: vimeoMatch[1] };
    return { type: null, id: null };
}


function getSeededIndex(array, seed) {
    if (!array.length) return 0;
    const x = Math.sin(seed) * 10000;
    const random = x - Math.floor(x);
    return Math.floor(random * array.length);
}
function getAutoThumbnail(vi) {
    if (!vi || !vi.id) return 'images/marketing.webp';
    if (vi.type === 'youtube') {
        return `https://img.youtube.com/vi/${vi.id}/maxresdefault.jpg`;
    }
    if (vi.type === 'vimeo') {
        // La API de Vimeo es asíncrona para obtener el thumbnail vía JSON, 
        // pero podemos usar vumbnail.com como un proxy rápido sin latencia de API.
        return `https://vumbnail.com/${vi.id}.jpg`;
    }
    return 'images/marketing.webp';
}
