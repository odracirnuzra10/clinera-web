const AI_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwJKtkMCOV8nDh3J5ngXzmU39xiB9zXbs6zFm5bTV1rlo6WKzm_XZXFFOzgEjEuIKF-/exec';
const APP_TOKEN = 'Clinera_Internal_Secure_Key_2026';
let allIncidents = [];
let currentIncident = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchIncidents();
});

async function fetchIncidents() {
    const tableBody = document.getElementById('adminTableBody');
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted);"><span class="material-symbols-rounded" style="animation: spin 1s infinite linear">refresh</span> Cargando reportes...</td></tr>';

    try {
        const response = await fetch(AI_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                type: 'get_incidents',
                token: APP_TOKEN
            })
        });

        if (!response.ok) throw new Error('Error en la red');

        allIncidents = await response.json();
        renderTable(allIncidents);

    } catch (error) {
        console.error("Admin Error:", error);
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 3rem; color: var(--pink);">Error cargando datos. Verifica los permisos de Apps Script.</td></tr>';
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('adminTableBody');
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted);">No hay reportes registrados.</td></tr>';
        return;
    }

    data.forEach(inc => {
        const tr = document.createElement('tr');

        // Formatear fecha
        const fecha = new Date(inc.fecha).toLocaleDateString() + ' ' + new Date(inc.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Clases para prioridad
        const prioClass = `prio-${inc.prioridad.toLowerCase()}`;

        // Clases para estado
        let statusClass = 'status-pendiente';
        if (inc.estado === 'En Proceso') statusClass = 'status-proceso';
        if (inc.estado === 'Resuelto') statusClass = 'status-resuelto';

        tr.innerHTML = `
            <td style="font-size: 0.8rem; color: var(--text-muted);">${fecha}</td>
            <td style="font-weight: 700;">#${inc.ticket_id}</td>
            <td style="color: var(--cyan); font-weight: 600;">${inc.clínica || 'N/A'}</td>
            <td>${inc.asunto}</td>
            <td><span style="font-size: 0.75rem;">${inc.categoría}</span></td>
            <td><span class="badge ${prioClass}">${inc.prioridad}</span></td>
            <td><span class="status-pill ${statusClass}">${inc.estado || 'Pendiente'}</span></td>
            <td>
                <button class="btn-icon" onclick="openAdminModal(${inc.ticket_id})">
                    <span class="material-symbols-rounded">open_in_new</span>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function filterTable() {
    const searchTerm = document.getElementById('adminSearch').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const catFilter = document.getElementById('filterCategory').value;

    const filtered = allIncidents.filter(inc => {
        const matchesSearch = inc.asunto.toLowerCase().includes(searchTerm) ||
            String(inc.ticket_id).includes(searchTerm) ||
            (inc.clínica && inc.clínica.toLowerCase().includes(searchTerm));
        const matchesStatus = statusFilter === 'all' || (inc.estado || 'Pendiente') === statusFilter;
        const matchesCat = catFilter === 'all' || inc.categoría === catFilter;

        return matchesSearch && matchesStatus && matchesCat;
    });

    renderTable(filtered);
}

function openAdminModal(ticketId) {
    currentIncident = allIncidents.find(i => i.ticket_id === ticketId);
    if (!currentIncident) return;

    document.getElementById('adminModalTicketNo').textContent = '#' + currentIncident.ticket_id;
    document.getElementById('adminModalClinic').textContent = currentIncident.clínica || 'No especificada';
    document.getElementById('adminModalDesc').textContent = currentIncident.descripción;

    const fileContainer = document.getElementById('adminModalFileContainer');
    if (currentIncident.link_archivo && currentIncident.link_archivo !== 'Sin archivo') {
        fileContainer.classList.remove('hidden');
        document.getElementById('adminModalFile').href = currentIncident.link_archivo;
    } else {
        fileContainer.classList.add('hidden');
    }

    document.getElementById('adminModal').classList.remove('hidden');
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.add('hidden');
    currentIncident = null;
}

async function updateIncidentStatus(newStatus) {
    if (!currentIncident) return;

    // UI Feedback inmediato
    const oldIncident = { ...currentIncident };
    const modal = document.getElementById('adminModal');
    const originalContent = modal.querySelector('.modal-body').innerHTML;

    modal.querySelector('.modal-body').innerHTML = '<div style="text-align:center; padding: 2rem;"><span class="material-symbols-rounded" style="animation: spin 1s infinite linear">refresh</span> Actualizando...</div>';

    try {
        const response = await fetch(AI_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                type: 'update_incident',
                token: APP_TOKEN,
                rowIndex: currentIncident.rowIndex,
                status: newStatus
            })
        });

        const result = await response.json();

        if (result.success) {
            // Actualizar localmente
            currentIncident.estado = newStatus;
            const index = allIncidents.findIndex(i => i.ticket_id === currentIncident.ticket_id);
            if (index !== -1) allIncidents[index].estado = newStatus;

            alert("Estado actualizado correctamente.");
            closeAdminModal();
            renderTable(allIncidents);
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        alert("Error al actualizar: " + error.message);
        modal.querySelector('.modal-body').innerHTML = originalContent;
    }
}

// Funciones Diagnóstico API
async function testApiStep(step) {
    const token = document.getElementById('diagToken').value.trim();
    if (!token) return logDiag('Error: Falta System Access Token', 'error');

    const businessId = document.getElementById('diagBusiness').value.trim();
    const wabaId = document.getElementById('diagWaba').value.trim();
    const phoneId = document.getElementById('diagPhone').value.trim();
    const pin = document.getElementById('diagPin').value.trim() || '123456';

    if (step === 1) {
        if (!businessId) return logDiag('Error: Falta Business ID', 'error');
        logDiag('--- PASO 1: Verificando Negocio ---', 'info');
        try {
            const req = await fetch(`https://graph.facebook.com/v21.0/${businessId}/owned_whatsapp_business_accounts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const res = await req.json();
            if (res.error) throw new Error(res.error.message);
            logDiag('ÉXITO: Vínculo con Negocio validado.', 'success');
            logDiag(JSON.stringify(res, null, 2), 'response');
        } catch (e) {
            logDiag(`FALLO PASO 1: ${e.message}`, 'error');
        }
    } 
    else if (step === 2) {
        if (!wabaId) return logDiag('Error: Falta WABA ID', 'error');
        logDiag('--- PASO 2: Suscribiendo App al WABA ---', 'info');
        try {
            const req = await fetch(`https://graph.facebook.com/v21.0/${wabaId}/subscribed_apps`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const res = await req.json();
            if (res.error) throw new Error(res.error.message);
            logDiag('ÉXITO: Suscripción de App al WABA confirmada.', 'success');
            logDiag(JSON.stringify(res, null, 2), 'response');
        } catch (e) {
            logDiag(`FALLO PASO 2: ${e.message}`, 'error');
        }
    }
    else if (step === 3) {
        if (!phoneId) return logDiag('Error: Falta Phone ID', 'error');
        logDiag(`--- PASO 3: Registrando Número (PIN: ${pin}) ---`, 'info');
        try {
            const req = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/register`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ messaging_product: 'whatsapp', pin: pin })
            });
            const res = await req.json();
            if (res.error) throw new Error(res.error.message);
            logDiag('ÉXITO: Número API registrado y activo.', 'success');
            logDiag(JSON.stringify(res, null, 2), 'response');
        } catch (e) {
            logDiag(`FALLO PASO 3: ${e.message}`, 'error');
        }
    }
    else if (step === 4) {
        if (!phoneId) return logDiag('Error: Falta Phone ID', 'error');
        logDiag('--- PASO 4: Health Check (Estado del número) ---', 'info');
        try {
            const req = await fetch(`https://graph.facebook.com/v21.0/${phoneId}?fields=status,name_status,code_verification_status`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const res = await req.json();
            if (res.error) throw new Error(res.error.message);
            logDiag(`ÉXITO: Certificado | Estado: ${res.status} | Nombre: ${res.name_status}`, 'success');
            logDiag(JSON.stringify(res, null, 2), 'response');
        } catch (e) {
            logDiag(`FALLO PASO 4: ${e.message}`, 'error');
        }
    }
}

function logDiag(message, type = 'info') {
    const cons = document.getElementById('diagConsole');
    let color = '#fff';
    if (type === 'error') color = '#f87171';
    if (type === 'success') color = '#4ade80';
    if (type === 'response') color = '#a78bfa';

    const el = document.createElement('div');
    el.style.color = color;
    el.style.marginBottom = '5px';
    if(type === 'response') {
        el.style.whiteSpace = 'pre-wrap';
        el.style.background = 'rgba(255,255,255,0.05)';
        el.style.padding = '10px';
        el.style.borderRadius = '5px';
        el.style.marginTop = '5px';
        el.style.marginBottom = '15px';
    }
    el.textContent = type === 'response' ? message : `> ${message}`;
    cons.appendChild(el);
    cons.scrollTop = cons.scrollHeight;
}
