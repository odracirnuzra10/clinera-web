/* CONFIGURATION */
const AI_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwJKtkMCOV8nDh3J5ngXzmU39xiB9zXbs6zFm5bTV1rlo6WKzm_XZXFFOzgEjEuIKF-/exec';
const APP_TOKEN = 'Clinera_Internal_Secure_Key_2026'; // 

// Session Storage Keys
const SESSION_KEY = 'clinera_session';
const USER_DATA_KEY = 'clinera_user_data';

/* PWA LOGIC - Dark Mode Only */

/* Demo Data (Fallback) */
const DEMO_TUTORIALS = [
    {
        id: '1',
        title: 'Demo: Configura tu Hoja de Google',
        category: 'Demo',
        duration: '1:00',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
];

let allTutorials = [];

document.addEventListener('DOMContentLoaded', () => {
    // 0. ACCESO DE INVITADO NATIVO (Widget Ayuda)
    const isGuest = window.location.search.includes('mode=guest');

    if (isGuest) {
        document.body.classList.add('guest-mode');
        // Hacemos el login de invitado automático
        const guestUser = { name: 'Invitado', email: null, picture: '/support/cuky.webp' };
        saveSession(guestUser, 'manual');

        // Inicializamos UI básica
        const nameDisplay = document.getElementById('userNameDisplay');
        if (nameDisplay) nameDisplay.textContent = 'Invitado';

        // Ir al chat DIRECTO después de asegurar que la sesión está guardada
        setTimeout(() => navigateTo('expert'), 100);
    } else {
        // 1. Check for existing session para usuarios normales
        checkExistingSession();
    }

    if (!isGuest) {
        // 1. Check for existing session (Solo médicos)
        checkExistingSession();
        // 2. PWA Init
        initPWA();
        // Non-blocking load
        setTimeout(() => {
            loadTutorials();
            updateOnboardingProgress();
        }, 100);
    }


    const searchInput = document.getElementById('tutorialSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeChip = document.querySelector('.cat-chip.active');
            const activeCat = activeChip ? activeChip.getAttribute('data-cat') : 'all';
            filterTutorials(activeCat, e.target.value);
        });
    }

    const faqSearch = document.getElementById('faqSearch');
    if (faqSearch) {
        faqSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.faq-item').forEach(item => {
                const title = item.querySelector('h4').textContent.toLowerCase();
                const content = item.querySelector('p').textContent.toLowerCase();
                if (title.includes(term) || content.includes(term)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    if (chatInput) {
        chatInput.addEventListener('input', (e) => {
            sendBtn.disabled = e.target.value.trim() === '';
        });
    }
});

/* SESSION MANAGEMENT */
function checkExistingSession() {
    const session = localStorage.getItem(SESSION_KEY);
    const userData = localStorage.getItem(USER_DATA_KEY);

    if (session && userData) {
        try {
            const user = JSON.parse(userData);
            const sessionData = JSON.parse(session);

            // Check if session is still valid
            if (sessionData.timestamp) {
                const hoursSinceLogin = (Date.now() - sessionData.timestamp) / (1000 * 60 * 60);
                if (hoursSinceLogin > 24 * 30) {
                    clearSession();
                    return;
                }
            }

            // Auto-login with stored session
            restoreSession(user);

            // CORRECCIÓN CRÍTICA: Si es invitado, forzar vista de experto (chat)
            if (document.body.classList.contains('guest-mode')) {
                navigateTo('expert');
            }
        } catch (e) {
            console.error('Error restoring session:', e);
            clearSession();
        }
    }
}

function restoreSession(userData) {
    // Update UI with user data
    const nameDisplay = document.getElementById('userNameDisplay');
    if (nameDisplay) nameDisplay.textContent = userData.name;

    const dot = document.querySelector('.status-dot');
    if (dot) dot.style.backgroundColor = 'var(--status-online)';

    const statusTxt = document.querySelector('.status-text');
    if (statusTxt) statusTxt.textContent = 'Conectado';

    // Update Avatar
    const avatarContainer = document.querySelector('.avatar-circle');
    if (avatarContainer) {
        avatarContainer.innerHTML = `<img src="${userData.picture || '/support/cuky.webp'}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;"> <div class="status-dot" style="display:block; background-color:var(--status-online);"></div>`;
    }

    // Switch to dashboard
    switchView('view-auth', 'view-dashboard');
}

function saveSession(userData, loginType) {
    const sessionData = {
        loginType: loginType, // 'google' or 'manual'
        timestamp: Date.now()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_DATA_KEY);
}

/* GOOGLE SIGN-IN HANDLER */
function handleGoogleSignIn(response) {
    try {
        // Decode JWT token to get user info
        const userObject = parseJwt(response.credential);

        const userData = {
            name: userObject.name,
            email: userObject.email,
            picture: userObject.picture
        };

        // Save session
        saveSession(userData, 'google');

        // Update UI
        handleLogin(userData.name, null, 'google', userData);

    } catch (error) {
        console.error('Google Sign-In Error:', error);
        alert('Error al iniciar sesión con Google. Por favor intenta de nuevo.');
    }
}

// Helper function to parse JWT
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

/* LOGOUT HANDLER */
function handleLogout() {
    // Clear session
    clearSession();

    // Sign out from Google if applicable
    if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
    }

    // Reset UI
    const nameDisplay = document.getElementById('userNameDisplay');
    if (nameDisplay) nameDisplay.textContent = 'Usuario';

    // Reset Avatar
    const avatarContainer = document.querySelector('.avatar-circle');
    if (avatarContainer) {
        avatarContainer.innerHTML = `<span class="material-symbols-rounded">person</span><div class="status-dot"></div>`;
    }

    // Switch back to auth view
    switchView('view-dashboard', 'view-auth');
}


/* PWA LOGIC - Dark Mode Only */
let deferredPrompt;

function initPWA() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js?v=5.2.0')
            .then(registration => {
                console.log('Service Worker Registered');
                // Detect update
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // New content is available; please refresh.
                                console.log('New content available, refreshing...');
                                window.location.reload();
                            }
                        }
                    };
                };
            })
            .catch(err => console.error('SW Error:', err));
    }

    // Force show prompt for demo purposes if not standalone
    if (!window.matchMedia('(display-mode: standalone)').matches) {
        setTimeout(() => {
            showInstallPrompt();
        }, 2000);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });
}
// iOS Check can be added if needed, kept simple now

function showInstallPrompt() {
    // Create prompt dynamically if not exists
    let prompt = document.getElementById('pwaPrompt');
    if (!prompt) {
        prompt = document.createElement('div');
        prompt.id = 'pwaPrompt';
        prompt.className = 'pwa-prompt visible';
        prompt.innerHTML = `
            <img src="/support/favicon CLINERA.png" alt="App Icon">
            <div class="pwa-text">
                <h5>Instalar App</h5>
                <p>Añade Clinera a tu inicio</p>
            </div>
            <button class="btn-install" onclick="installPWA()">Instalar</button>
            <button class="theme-toggle" onclick="closePWA()" style="margin-left:auto; background:none; border:none; color:var(--text-muted); cursor:pointer;"><span class="material-symbols-rounded">close</span></button>
        `;
        document.body.appendChild(prompt);
    } else {
        prompt.classList.add('visible');
    }
}

function closePWA() {
    document.getElementById('pwaPrompt').classList.remove('visible');
}

async function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            deferredPrompt = null;
        }
        closePWA();
    }
}


/* === GOOGLE AUTH LOGIC REMOVED FOR SIMPLIFIED ACCESS === */

/* APP CORE FUNCTIONS */
function handleLogin(inputName, clientId, loginType = 'manual', userData = null) {
    if (!inputName) return;
    try {
        const btn = document.querySelector('.btn-primary');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="material-symbols-rounded" style="animation: spin 1s infinite linear">refresh</span> Accediendo...';

        setTimeout(() => {
            // Simple capitalization
            const formattedName = inputName.charAt(0).toUpperCase() + inputName.slice(1);

            // Prepare user data for session
            const userDataToSave = userData || {
                name: formattedName,
                email: null,
                picture: null
            };

            // Save session
            saveSession(userDataToSave, loginType);

            const nameDisplay = document.getElementById('userNameDisplay');
            if (nameDisplay) nameDisplay.textContent = formattedName;

            const dot = document.querySelector('.status-dot');
            if (dot) dot.style.backgroundColor = 'var(--status-online)';

            const statusTxt = document.querySelector('.status-text');
            if (statusTxt) statusTxt.textContent = 'Conectado';

            // Update Avatar
            const avatarContainer = document.querySelector('.avatar-circle');
            if (avatarContainer) {
                avatarContainer.innerHTML = `<img src="${userDataToSave.picture || '/support/cuky.webp'}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;"> <div class="status-dot" style="display:block; background-color:var(--status-online);"></div>`;
            }

            // MODO WIDGET: Saltar dashboard e ir directo al chat
            if (document.body.classList.contains('guest-mode')) {
                switchView('view-auth', 'view-expert');
            } else {
                switchView('view-auth', 'view-dashboard');
            }

            // Optional: Trigger Install Prompt if available
            if (deferredPrompt) showInstallPrompt();

            btn.disabled = false;
            btn.innerHTML = originalText;
        }, 800);
    } catch (err) {
        console.error("Login UI Error:", err);
        // Fallback for emergency login
        switchView('view-auth', 'view-dashboard');
    }
}

function switchView(fromId, toId) {
    const fromEl = document.getElementById(fromId);
    const toEl = document.getElementById(toId);

    if (fromEl && toEl) {
        // Safe navigation check
        if (fromEl.classList.contains('hidden')) {
            const allViews = document.querySelectorAll('section[id^="view-"]');
            allViews.forEach(v => {
                if (!v.classList.contains('hidden') && v.id !== toId) {
                    v.style.opacity = '0';
                    setTimeout(() => v.classList.add('hidden'), 300);
                }
            });

            toEl.classList.remove('hidden');
            toEl.style.opacity = '0'; // reset
            void toEl.offsetWidth;
            toEl.classList.add('fade-in');
            toEl.style.opacity = '1';
            return;
        }

        fromEl.style.opacity = '0';
        setTimeout(() => {
            fromEl.classList.add('hidden');
            fromEl.style.opacity = '1';
            toEl.classList.remove('hidden');
            void toEl.offsetWidth;
            toEl.classList.add('fade-in');

            if (toId === 'view-expert') {
                const container = document.getElementById('chatContainer');
                container.scrollTop = container.scrollHeight;
            }
        }, 300);
    }
}

function navigateTo(viewName) {
    const views = ['view-auth', 'view-dashboard', 'view-expert', 'view-tutorials', 'view-incident', 'view-onboarding', 'view-faqs', 'view-blog', 'view-promptgen'];
    const currentViewIds = views.filter(id => {
        const el = document.getElementById(id);
        return el && !el.classList.contains('hidden');
    });
    const currentView = currentViewIds[0];

    const targetId = `view-${viewName}`;
    if (currentView && targetId && currentView !== targetId) {
        switchView(currentView, targetId);

        // Load data if needed
        if (viewName === 'faqs') loadFaqs();
        if (viewName === 'onboarding') loadOnboarding();
        if (viewName === 'dashboard') updateOnboardingProgress();
    }
}

/* TUTORIALS LOGIC */
async function loadTutorials() {
    const container = document.getElementById('tutorialsContainer');

    try {
        const response = await fetch(AI_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                type: 'get_tutorials',
                token: APP_TOKEN
            })
        });

        if (!response.ok) throw new Error('Error en la red');

        allTutorials = await response.json();

        renderCategories(allTutorials);
        renderTutorials(allTutorials, container);
    } catch (error) {
        console.error("Error loading tutorials:", error);
        allTutorials = DEMO_TUTORIALS;
        renderCategories(allTutorials);
        renderTutorials(allTutorials, container);
    }
}

function renderCategories(videos) {
    const scrollContainer = document.getElementById('tutorialsCategories');
    // Clear keeping only the first static "Todos" button if we wanted, 
    // but better to rebuild the 'Todos' button to include count.
    scrollContainer.innerHTML = '';

    // 1. Calculate Counts
    const counts = {};
    videos.forEach(v => {
        const cat = v.category ? v.category.trim() : 'General';
        counts[cat] = (counts[cat] || 0) + 1;
    });

    // 2. Sort categories by frequency (descending)
    const sortedCats = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

    // 3. Take Top 3
    const topCats = sortedCats.slice(0, 3);

    // 4. Create "Todos" Button
    const totalCount = videos.length;
    const allBtn = document.createElement('button');
    allBtn.className = 'cat-chip active';
    allBtn.setAttribute('data-cat', 'all');
    // "Todos (12)"
    allBtn.textContent = `Todos (${totalCount})`;
    allBtn.onclick = (e) => handleCatClick(e, 'all');
    scrollContainer.appendChild(allBtn);

    // 5. Create Buttons for Top 3
    topCats.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'cat-chip';
        btn.setAttribute('data-cat', cat);
        // "Ventas (5)"
        btn.textContent = `${cat} (${counts[cat]})`;
        btn.onclick = (e) => handleCatClick(e, cat);
        scrollContainer.appendChild(btn);
    });
}

function handleCatClick(e, category) {
    // 1. UI Update
    document.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    // 2. Filter
    const searchVal = document.getElementById('tutorialSearch').value;
    filterTutorials(category, searchVal);
}

/* Helper to extract video info from various URL formats */
function getVideoInfo(url) {
    if (!url) return { type: null, id: null };

    // YouTube
    const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const ytMatch = url.match(ytRegExp);
    if (ytMatch && ytMatch[2].length === 11) {
        return { type: 'youtube', id: ytMatch[2] };
    }

    // Vimeo
    const vimeoRegExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegExp);
    if (vimeoMatch) {
        return { type: 'vimeo', id: vimeoMatch[1] };
    }

    return { type: null, id: null };
}

/* Helper to extract YouTube ID (Legacy support) */
function extractYouTubeID(url) {
    return getVideoInfo(url).id;
}

async function renderTutorials(list, container) {
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted); text-align:center; grid-column:span 2;">No se encontraron videos.</p>';
        return;
    }

    // Render loop
    for (const video of list) {
        // 2. Auto-Fetch Title if missing (Async "Lazy" Load)
        if ((!video.title || video.title === 'Sin Título') && video.videoUrl) {
            try {
                const ytId = extractYouTubeID(video.videoUrl);
                if (ytId) {
                    // Creating a detached fetch to not block rendering of other cards
                    fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.title) {
                                document.getElementById(`title-${video.id}`).textContent = data.title;
                                video.title = data.title; // Cache it
                            }
                        })
                        .catch(() => { }); // Silent fail
                }
            } catch (e) { }
        }

        const el = document.createElement('article');
        el.className = 'video-card';
        el.onclick = () => openVideoModal(video);

        const vInfo = getVideoInfo(video.videoUrl);
        let finalThumb = video.thumbnail && video.thumbnail !== '' ? video.thumbnail : null;

        if (!finalThumb) {
            finalThumb = getAutoThumbnail(vInfo);
        }

        let imageHTML = '';
        if (finalThumb) {
            const fallback = vInfo.type === 'youtube' ? `https://img.youtube.com/vi/${vInfo.id}/mqdefault.jpg` : '/support/favicon CLINERA.png';
            imageHTML = `<img src="${finalThumb}" alt="Video" loading="lazy" onerror="this.src='${fallback}'">`;
        } else {
            imageHTML = `<div style="width:100%;height:100%;background:#000;"></div>`;
        }

        // Duration UI logic
        const durationHTML = video.duration && video.duration !== 'min' ? `<span>${video.duration}</span>` : '';

        el.innerHTML = `
            <div class="thumbnail-container">
                ${imageHTML}
                <div class="play-overlay"><span class="material-symbols-rounded">play_arrow</span></div>
            </div>
            <div class="video-info">
                <h4 id="title-${video.id}">${video.title !== 'Sin Título' ? video.title : 'Cargando título...'}</h4>
                <div class="video-meta">
                    <span>${video.category || 'General'}</span>
                    ${durationHTML}
                </div>
            </div>`;
        container.appendChild(el);
    }
}

function filterTutorials(category, searchTerm) {
    const term = searchTerm.toLowerCase();

    // category comes from data-cat attribute. 'all' is special.
    const isAll = category === 'all';

    const filtered = allTutorials.filter(video => {
        // Normalize video category for comparison
        const vCat = video.category ? video.category.trim() : 'General';

        // Strict match (or 'all')
        const matchesCat = isAll || vCat === category;
        const matchesSearch = video.title.toLowerCase().includes(term);
        return matchesCat && matchesSearch;
    });
    renderTutorials(filtered, document.getElementById('tutorialsContainer'));
}

function openVideoModal(video) {
    const modal = document.getElementById('videoModal');
    document.getElementById('modalTitle').textContent = video.title;

    // Handle standard URL to Embed format
    let src = video.videoUrl;
    const vInfo = getVideoInfo(src);

    if (vInfo.type === 'youtube') {
        src = `https://www.youtube.com/embed/${vInfo.id}?autoplay=1`;
    } else if (vInfo.type === 'vimeo') {
        src = `https://player.vimeo.com/video/${vInfo.id}?autoplay=1`;
    }

    document.getElementById('videoFrameContainer').innerHTML = `<iframe src="${src}" allowfullscreen></iframe>`;
    modal.classList.remove('hidden');
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    modal.classList.add('hidden');
    document.getElementById('videoFrameContainer').innerHTML = '';
}

async function handleChatSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    // 1. Show User Message
    addMessage(message, 'user');
    input.value = '';
    document.getElementById('sendBtn').disabled = true;

    // 2. Show Typing Indicator
    const typing = document.getElementById('typingIndicator');
    typing.classList.remove('hidden');
    const container = document.getElementById('chatContainer');
    container.scrollTop = container.scrollHeight;

    // 3. Call AI Endpoint
    try {
        // Use 'no-cors' mode is NOT recommended for reading response, standard fetch works with Apps Script 
        // if "Anyone" access is set correctly. Browsers handle the redirect automatically.
        // We use text/plain content type to avoid preflight complications in some cases.

        const response = await fetch(AI_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                message: message,
                token: APP_TOKEN
            }),
        });

        if (!response.ok) throw new Error('Error en la red');

        const data = await response.json();

        // Hide typing
        typing.classList.add('hidden');

        // Show AI Response
        const reply = data.response || "Lo siento, no pude procesar tu respuesta.";
        addMessage(reply, 'bot');

    } catch (error) {
        console.error("AI Error:", error);
        typing.classList.add('hidden');
        addMessage("Tuve un problema conectando con el servidor. Por favor intenta de nuevo.", 'bot');
    }
}

function sendSuggestion(text) {
    document.getElementById('chatInput').value = text;
    document.getElementById('sendBtn').disabled = false;
    // Trigger submit manually
    handleChatSubmit();
}

function addMessage(text, sender) {
    const container = document.getElementById('chatContainer');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;

    let avatarHTML = sender === 'bot'
        ? '<div class="avatar cuky-avatar"></div>'
        : '<div class="avatar"><span class="material-symbols-rounded">person</span></div>';

    // 1. Basic Markdown-ish formatting
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/\n/g, '<br>');

    // 2. Parse Video Patterns: [[VIDEO:URL|TITLE|THUMB]]
    const videoRegex = /\[\[VIDEO:(.*?)\|(.*?)\|(.*?)\]\]/g;
    let videoCardsHTML = '';

    formattedText = formattedText.replace(videoRegex, (match, url, title, thumb) => {
        const vInfo = getVideoInfo(url);
        let finalThumb = thumb && thumb !== 'undefined' ? thumb : null;

        if (!finalThumb) {
            finalThumb = getAutoThumbnail(vInfo);
        }

        videoCardsHTML += `
            <div class="chat-video-card" onclick="openVideoModal({videoUrl:'${url}', title:'${title.replace(/'/g, "\\'")}'})">
                <div class="chat-video-thumb">
                    <img src="${finalThumb}" alt="Video" onerror="this.src='/support/favicon CLINERA.png'">
                    <div class="chat-video-play"><span class="material-symbols-rounded">play_circle</span></div>
                </div>
                <div class="chat-video-info">
                    <span class="chat-video-tag">Tutorial</span>
                    <h5>${title}</h5>
                </div>
            </div>
        `;
        return ''; // Remove from text flow to place it as a card below
    });

    msgDiv.innerHTML = `
        ${avatarHTML}
        <div class="bubble">
            <p>${formattedText}</p>
            ${videoCardsHTML}
        </div>
    `;
    const typing = document.getElementById('typingIndicator');
    container.insertBefore(msgDiv, typing);
    container.scrollTop = container.scrollHeight;
}

function clearChat() {
    const container = document.getElementById('chatContainer');
    container.innerHTML = `
        <div class="chat-message bot">
            <div class="avatar cuky-avatar"></div>
            <div class="bubble">
                <p>Hola, soy Cuky y te puedo ayudar con lo que necesites hacer en Clinera. ¿En qué puedo ayudarte?</p>
                <div class="suggestions">
                    <button onclick="sendSuggestion('¿Cómo registro un paciente?')">¿Cómo registro un paciente?</button>
                    <button onclick="sendSuggestion('Crear una clínica')">Crear una clínica</button>
                    <button onclick="sendSuggestion('Problemas con Turnos')">Problemas con Turnos</button>
                </div>
            </div>
        </div>
        <div class="typing-indicator hidden" id="typingIndicator">
            <span></span><span></span><span></span>
        </div>
    `;
}
// Removed generateMockResponse as it is no longer needed

/* INCIDENTS LOGIC */
function handleFileSelect(input) {
    const preview = document.getElementById('filePreview');
    const nameSpan = preview.querySelector('.file-name');
    const dropMSG = document.querySelector('.file-msg');

    if (input.files && input.files[0]) {
        nameSpan.textContent = input.files[0].name;
        preview.classList.remove('hidden');
        dropMSG.style.display = 'none';
    }
}

function removeFile(e) {
    e.stopPropagation();
    const input = document.getElementById('incFile');
    input.value = '';
    document.getElementById('filePreview').classList.add('hidden');
    document.querySelector('.file-msg').style.display = 'block';
}

async function handleIncidentSubmit(e) {
    e.preventDefault();

    const btn = document.getElementById('submitIncidentBtn');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-rounded" style="animation: spin 1s infinite linear">refresh</span> Enviando...';

    // 1. Gather Data
    const clinicName = document.getElementById('incClinic').value;
    const subject = document.getElementById('incSubject').value;
    const category = document.getElementById('incCategory').value;
    const priority = document.getElementById('incPriority').value;
    const description = document.getElementById('incDescription').value;
    const fileInput = document.getElementById('incFile');

    let fileData = null;
    let fileName = null;
    let mimeType = null;


    // 2. Read File if present (Async)
    if (fileInput.files.length > 0) {
        try {
            const file = fileInput.files[0];
            // Limit size check (e.g. 10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                alert("El archivo es demasiado grande. Máximo 10MB.");
                throw new Error("File too big");
            }

            fileName = file.name;
            mimeType = file.type;
            fileData = await readFileAsBase64(file);
        } catch (err) {
            btn.disabled = false;
            btn.innerHTML = originalText;
            return;
        }
    }

    // 3. Send to Backend
    const ticketId = Math.floor(Math.random() * 9000 + 1000);

    const payload = {
        type: 'incident',
        token: APP_TOKEN,
        ticketId: ticketId,
        clinicName: clinicName,
        subject: subject,
        category: category,
        priority: priority,
        description: description,
        fileData: fileData,
        fileName: fileName,
        mimeType: mimeType
    };

    try {
        const response = await fetch(AI_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            // Success UI
            document.getElementById('ticketId').textContent = '#' + ticketId;
            document.getElementById('incidentSuccess').classList.remove('hidden');
        } else {
            alert("Error del servidor: " + (result.message || "Desconocido"));
        }

    } catch (error) {
        console.error("Incident Error:", error);
        alert("Error de conexión. Inténtalo de nuevo.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// Helper to read file
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function resetIncidentForm() {
    document.getElementById('incidentForm').reset();
    document.getElementById('filePreview').classList.add('hidden');
    document.getElementById('incidentSuccess').classList.add('hidden');
    document.querySelector('.file-msg').style.display = 'block';

    navigateTo('dashboard');
}

/* === NEW APP MODULES: INTERACTIVE ONBOARDING & FAQ HUB === */

const ONBOARDING_DATA = [
    {
        title: "PASO 1: Configuración e Identidad de la Clínica",
        subtitle: "Establece los cimientos y el look de tu centro médico.",
        substeps: [
            "Info Básica: Nombre de la clínica, dirección, descripción, moneda, etc.",
            "Branding: Subir logo oficial y definir colores de marca."
        ]
    },
    {
        title: "PASO 2: Creación de la Sucursal (Obligatorio)",
        subtitle: "Sin una sucursal activa no podrás configurar agendas.",
        substeps: [
            "Crea tu sede física en Configuración > Sucursales y completa su ficha técnica."
        ]
    },
    {
        title: "PASO 3: Configuración de servicios",
        subtitle: "Define qué servicios ofreces para que la IA sepa qué vender.",
        substeps: [
            "Crea especialidades y luego tratamientos (con su duración obligatoria)."
        ]
    },
    {
        title: "PASO 4: Equipo y Profesionales",
        subtitle: "Es hora de activar los calendarios de tu equipo.",
        substeps: [
            "Registra a tus profesionales y vincula sus especialidades, tratamientos y horarios."
        ]
    },
    {
        title: "PASO 5: Activar WhatsApp API 🔗",
        subtitle: "Este es el motor de comunicación de tu IA.",
        substeps: [
            "Conecta tu número oficial en https://clinera.io/register-api siguiendo al asistente."
        ]
    },
    {
        title: "PASO 6: Cerebro del Agente IA ✨",
        subtitle: "Dale personalidad y conocimiento a tu asistente virtual.",
        substeps: [
            "Define el tono de voz y carga el entrenamiento sobre negocio y staff."
        ]
    },
    {
        title: "PASO 7: Automatizaciones de Marketing",
        subtitle: "Crea flujos de trabajo que trabajen por ti.",
        substeps: [
            "Activa nodos de WhatsApp y esperas para gestionar tus citas automáticamente."
        ]
    }
];

function linkify(text) {
    if (!text) return "";
    // Detect URLs and convert to <a> tags
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlPattern, function (url) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${url}</a>`;
    });
}

function loadOnboarding(openIdx = null) {
    const board = document.getElementById('onboardingBoard');
    if (!board) return;

    board.innerHTML = '';

    // Get saved progress or initial
    const saved = JSON.parse(localStorage.getItem('clinera_onboarding_progress') || '{}');

    ONBOARDING_DATA.forEach((step, stepIdx) => {
        const item = document.createElement('div');
        item.className = 'onboarding-item-hub';
        item.id = `step-hub-${stepIdx}`;

        // Mantener abierto si se especificó
        if (openIdx === stepIdx) item.classList.add('expanded');

        let subStepsHTML = '';
        let completedInThisStep = 0;

        step.substeps.forEach((subtext, subIdx) => {
            const isDone = saved[`${stepIdx}-${subIdx}`] === true;
            if (isDone) completedInThisStep++;

            subStepsHTML += `
                <div class="substep-row ${isDone ? 'done' : ''}" onclick="toggleSubstep(event, ${stepIdx}, ${subIdx})">
                    <div class="hub-checkbox ${isDone ? 'checked' : ''}">
                        <span class="material-symbols-rounded">check</span>
                    </div>
                    <div class="substep-text">${linkify(subtext)}</div>
                </div>
            `;
        });

        const isStepComplete = completedInThisStep === step.substeps.length;
        if (isStepComplete) item.classList.add('completed');

        item.innerHTML = `
            <div class="onboarding-item-header" onclick="toggleAccordion(${stepIdx})">
                <div class="step-badge-hub">${stepIdx + 1}</div>
                <h4>${step.title}</h4>
                <span class="material-symbols-rounded onboarding-chevron">expand_more</span>
            </div>
            <div class="onboarding-item-body">
                <div class="onboarding-body-content">
                    <p class="step-desc-hub">${step.subtitle}</p>
                    <div class="substeps-list">
                        ${subStepsHTML}
                    </div>
                </div>
            </div>
        `;
        board.appendChild(item);
    });

    updateOnboardingProgress();
}

function toggleAccordion(idx) {
    const el = document.getElementById(`step-hub-${idx}`);
    const isExpanded = el.classList.contains('expanded');

    // Close all
    document.querySelectorAll('.onboarding-item-hub').forEach(item => item.classList.remove('expanded'));

    // Toggle current
    if (!isExpanded) {
        el.classList.add('expanded');
    }
}

function toggleSubstep(event, stepIdx, subIdx) {
    event.stopPropagation(); // Evitar que el clic cierre el acordeón
    const saved = JSON.parse(localStorage.getItem('clinera_onboarding_progress') || '{}');
    const key = `${stepIdx}-${subIdx}`;

    saved[key] = !saved[key];
    localStorage.setItem('clinera_onboarding_progress', JSON.stringify(saved));

    loadOnboarding(stepIdx); // Re-renderizar manteniendo el paso actual abierto
}

function updateOnboardingProgress() {
    const saved = JSON.parse(localStorage.getItem('clinera_onboarding_progress') || '{}');
    const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}');
    const userEmail = userData.email || 'local_user';

    // Key for this specific user's completion status
    const completionKey = `clinera_onboarding_complete_${userEmail}`;
    const alreadyComplete = localStorage.getItem(completionKey) === 'true';

    const totalSubsteps = ONBOARDING_DATA.reduce((acc, step) => acc + step.substeps.length, 0);
    const completedSubsteps = Object.keys(saved).filter(key => saved[key] === true).length;

    // Cap at 100%
    const percent = Math.min(100, Math.round((completedSubsteps / totalSubsteps) * 100));

    // Update Views
    const percentLabel = document.getElementById('onboardingOverallPercent');
    const barFill = document.getElementById('onboardingOverallBar');
    const miniPercent = document.getElementById('miniProgressPercent');

    if (percentLabel) percentLabel.textContent = `${percent}%`;
    if (barFill) barFill.style.width = `${percent}%`;
    if (miniPercent) miniPercent.textContent = `${percent}%`;

    // Handle Completion Logic
    if (percent === 100 && !alreadyComplete) {
        showOnboardingCompletion();
        localStorage.setItem(completionKey, 'true');
    }

    // Disable dashboard card if complete
    const onboardingCard = document.querySelector('.card-onboarding');
    if (onboardingCard) {
        if (alreadyComplete || percent === 100) {
            onboardingCard.style.opacity = '0.6';
            onboardingCard.style.pointerEvents = 'none';
            onboardingCard.style.cursor = 'default';
            const badge = onboardingCard.querySelector('.mini-progress-badge');
            if (badge) {
                badge.textContent = '¡Completado!';
                badge.style.background = 'var(--status-online)';
                badge.style.color = '#000';
            }
        }
    }
}

function showOnboardingCompletion() {
    const overlay = document.getElementById('onboardingCompletionOverlay');
    if (overlay) overlay.classList.remove('hidden');
}

// Update FAQ functions to use Hub styles
async function loadFaqs() {
    const container = document.getElementById('faqHubContainer');
    if (!container) return;

    container.innerHTML = '<div class="loading-state"><span class="spinner"></span><p>Consultando base de conocimientos...</p></div>';

    try {
        const res = await fetch(AI_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({ type: 'get_faqs', token: APP_TOKEN })
        });
        const faqs = await res.json();
        renderFaqsHub(faqs);
    } catch (err) {
        container.innerHTML = '<p class="error-msg" style="text-align:center; padding:2rem;">Error al conectar con el servidor.</p>';
    }
}

function renderFaqsHub(list) {
    const container = document.getElementById('faqHubContainer');
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-muted);">No hay preguntas disponibles por el momento.</p>';
        return;
    }

    list.forEach((faq, i) => {
        const item = document.createElement('div');
        item.className = 'faq-item-hub';
        item.innerHTML = `
            <div class="faq-item-hub-header" onclick="this.parentElement.classList.toggle('active')">
                <div class="faq-icon-hub"><span class="material-symbols-rounded">quiz</span></div>
                <h4>${faq.title}</h4>
                <span class="material-symbols-rounded faq-toggle">expand_more</span>
            </div>
            <div class="faq-item-hub-body">
                <p>${linkify(faq.content)}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

/* PROMPT GENERATOR LOGIC */
function toggleModality(type) {
    const check = document.getElementById(`checkMod${type}`);
    const container = document.getElementById(`containerMod${type}`);
    const area = document.getElementById(`mod${type}Area`);

    if (check.checked) {
        container.classList.remove('hidden');
        area.classList.add('active'); // Added
    } else {
        container.classList.add('hidden');
        area.classList.remove('active'); // Added
    }
}

function toggleLinkInput(type) {
    const clinera = document.getElementById('clineraLinkInput');
    const custom = document.getElementById('customLinkInput');
    const slugHelp = document.getElementById('slugHelpSection'); // Added

    if (type === 'clinera') {
        clinera.classList.remove('hidden');
        custom.classList.add('hidden');
        if (slugHelp) slugHelp.classList.remove('hidden'); // Added
    } else {
        clinera.classList.add('hidden');
        custom.classList.remove('hidden');
        if (slugHelp) slugHelp.classList.add('hidden'); // Added
    }
}

async function generatePrompt(e) {
    e.preventDefault();

    // 0. RESET STATE: Garantizar que no hay "memoria" de ejecuciones anteriores
    let finalSchedulingInfo = "";
    let wspInfo = "";
    let dataInfo = "";
    let metaPrompt = "";

    const btn = document.getElementById('btnGenPrompt');
    // const treatments = document.getElementById('promptTreatments').value.trim();
    const styleOption = document.querySelector('input[name="promptStyleOption"]:checked');
    if (!styleOption) {
        alert("Selecciona un Estilo de Personalidad.");
        return;
    }
    const style = styleOption.value;
    const loadingArea = document.getElementById('promptLoading');
    const outputArea = document.getElementById('promptOutputArea');
    const textArea = document.getElementById('generatedPromptText');



    // Modalidades
    const isLinkEnabled = document.getElementById('checkModLink').checked;
    const isWspEnabled = document.getElementById('checkModWSP').checked;
    const isDataEnabled = document.getElementById('checkModData').checked;

    if (!isLinkEnabled && !isWspEnabled && !isDataEnabled) {
        alert("Selecciona al menos una modalidad de agendamiento.");
        return;
    }

    // 1. Enlace
    if (isLinkEnabled) {
        const linkType = document.querySelector('input[name="linkType"]:checked').value;
        if (linkType === 'clinera') {
            const slug = document.getElementById('promptSlug').value.trim();
            if (!slug) { alert("Ingresa tu Slug de Clinera o desactiva la opción de enlace."); return; }
            finalSchedulingInfo = `Enlace de agendamiento directo: https://app.clinera.io/embed/${slug}/modal`;
        } else {
            const customUrl = document.getElementById('promptCustomLink').value.trim();
            if (!customUrl) { alert("Ingresa el enlace externo o desactiva la opción."); return; }
            finalSchedulingInfo = `Enlace de agendamiento externo (ajeno a Clinera): ${customUrl}`;
        }
    }

    // 2. WhatsApp
    if (isWspEnabled) {
        const num = document.getElementById('promptWSPNumber').value.trim();
        if (!num) { alert("Ingresa el número de WhatsApp."); return; }
        wspInfo = `Instrucción de derivación humana: Si el usuario pide hablar con alguien real o el agendamiento por enlace no le acomoda, entrégale este número de WhatsApp: ${num}`;
    }

    // 3. Captura Datos
    if (isDataEnabled) {
        const fields = Array.from(document.querySelectorAll('.data-field:checked')).map(el => el.value);
        if (fields.length > 0) {
            dataInfo = `REQUERIMIENTO OBLIGATORIO: Antes de terminar la conversación o agendar, debes solicitar educadamente los siguientes datos para registro interno: ${fields.join(', ')}.`;
        }
    }

    // Reset UI
    btn.disabled = true;
    outputArea.classList.add('hidden');
    loadingArea.classList.remove('hidden');

    // Construcción dinámica de la lógica de agendamiento para el Meta-Prompt
    let schedulingLogic = "";
    if (isLinkEnabled) {
        schedulingLogic += `- LÓGICA DE AGENDAMIENTO: Debes dirigir a los pacientes al siguiente enlace oficial: ${finalSchedulingInfo}. Úsalo solo cuando la intención sea clara.\n`;
    }
    if (isWspEnabled) {
        schedulingLogic += `- LÓGICA DE DERIVACIÓN: Si el paciente prefiere atención humana o tiene dudas que no puedes resolver, entrégale este contacto: ${wspInfo}.\n`;
    }
    if (isDataEnabled) {
        schedulingLogic += `- REGLA DE DATOS (LEAD MAGNET): ${dataInfo}\n`;
    }

    // Definición de comportamiento base según estilo
    let personalityStyle = (style === 'conversacional')
        ? 'Modelo CONVERSACIONAL (The Guide): Actúa como un asesor empático. Haz preguntas paso a paso para perfilar las necesidades del paciente antes de ofrecer soluciones o precios. No presiones el cierre de inmediato.'
        : 'Modelo DIRECTO (The Shortcut): Responde de forma muy rápida y concisa (máximo 3 líneas). Prioriza el cierre rápido y ofrece las opciones de agendamiento habilitadas en la primera o segunda interacción.';

    metaPrompt = `Actúa como un experto en Ingeniería de Prompts (Prompt Engineering) para salud. Redacta un System Prompt exacto para un agente virtual de WhatsApp.
    
CONTEXTO DE LA CLÍNICA:
- Utiliza la información proporcionada por el usuario sobre su centro de salud.

${schedulingLogic !== "" ? `INSTRUCCIONES DE CIERRE Y AGENDAMIENTO (IMPORTANTE: Usa SOLO estas lógicas, no inventes otras):\n${schedulingLogic}` : '- NO ofrezcas agendamiento proactivamente, solo informa sobre los tratamientos.'}

ESTILO DEL AGENTE:
${personalityStyle}

INSTRUCCIÓN FINAL PARA LA GENERACIÓN:
Devuélveme ÚNICAMENTE el texto final del System Prompt en español que el usuario debe copiar. El prompt debe ser profesional, usar emojis pertinentes y estar optimizado para WhatsApp. 
IMPORTANTE: 
1. Si no se mencionó un link de agendamiento o un WhatsApp en las instrucciones de cierre, NO inventes ninguno ni menciones la palabra "link" o "enlace" en el prompt generado.
2. NO incluyas bajo ninguna circunstancia enlaces a videos de tutoriales del sistema dentro del cuerpo del prompt.`;

    try {
        const response = await fetch(AI_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                message: metaPrompt,
                token: APP_TOKEN
            }),
        });

        if (!response.ok) throw new Error('Error al conectar con la IA');

        const data = await response.json();

        let generatedText = data.response;
        if (generatedText) {
            // Limpiar comillas indeseadas
            generatedText = generatedText.replace(/^"|"$/g, '').trim();
            // FILTRO DE SEGURIDAD: Eliminar cualquier etiqueta de video que la IA haya colado
            generatedText = generatedText.replace(/\[\[VIDEO:.*?\]\]/gi, '');
            generatedText = generatedText.replace(/https:\/\/vimeo\.com\/\d+/gi, '');
            generatedText = generatedText.trim();
        } else {
            generatedText = "Hubo un error al generar el prompt. Por favor intenta de nuevo.";
        }

        textArea.value = generatedText;
        loadingArea.classList.add('hidden');
        outputArea.classList.remove('hidden');

    } catch (error) {
        console.error("Prompt Generation Error:", error);
        loadingArea.classList.add('hidden');
        textArea.value = "Ocurrió un error al contactar con la IA. Intenta de nuevo.";
        outputArea.classList.remove('hidden');
    } finally {
        btn.disabled = false;
    }
}

function copyGeneratedPrompt() {
    const textArea = document.getElementById('generatedPromptText');
    const btn = document.getElementById('copyPromptBtn');
    const prevHTML = btn.innerHTML;

    textArea.select();
    textArea.setSelectionRange(0, 99999); // Mobile
    navigator.clipboard.writeText(textArea.value).then(() => {
        btn.innerHTML = '<span class="material-symbols-rounded" style="font-size:16px;">check</span> ¡Copiado!';
        btn.style.background = '#00F0FF';
        setTimeout(() => {
            btn.innerHTML = prevHTML;
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}
function getAutoThumbnail(vi) {
    if (!vi || !vi.id) return '/support/favicon CLINERA.png';
    if (vi.type === 'youtube') {
        return `https://img.youtube.com/vi/${vi.id}/maxresdefault.jpg`;
    }
    if (vi.type === 'vimeo') {
        return `https://vumbnail.com/${vi.id}.jpg`;
    }
    return '/support/favicon CLINERA.png';
}
