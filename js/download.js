/* ============================================================
   PRODIGIO TECNOLÓGICO – download.js  (versión robusta)
   Funciones JS para Blazor WASM: toasts, PDF de factura
   ============================================================ */

// ── TOAST CONTAINER (creado bajo demanda) ────────────────────
function getOrCreateToastContainer() {
    let container = document.getElementById('prodigio-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'prodigio-toast-container';
        container.style.cssText = [
            'position:fixed',
            'top:20px',
            'right:20px',
            'z-index:99999',
            'display:flex',
            'flex-direction:column',
            'gap:10px',
            'pointer-events:none'
        ].join(';');
        document.body.appendChild(container);
    }
    return container;
}

// ── INYECTAR ESTILOS DE TOAST (solo una vez) ─────────────────
(function injectToastStyles() {
    if (document.getElementById('prodigio-toast-styles')) return;
    const style = document.createElement('style');
    style.id = 'prodigio-toast-styles';
    style.textContent = `
        .prodigio-toast {
            background: #fff;
            border-radius: 10px;
            padding: 14px 18px;
            box-shadow: 0 6px 24px rgba(0,0,0,0.18);
            opacity: 0;
            transform: translateX(110%);
            transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
            min-width: 280px;
            max-width: 380px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            pointer-events: all;
        }
        .prodigio-toast.visible {
            opacity: 1;
            transform: translateX(0);
        }
        .prodigio-toast.success { border-left: 4px solid #10b981; background: #ecfdf5; }
        .prodigio-toast.error   { border-left: 4px solid #ef4444; background: #fef2f2; }
        .prodigio-toast.info    { border-left: 4px solid #3b82f6; background: #eff6ff; }
        .prodigio-toast .t-icon { font-size: 18px; font-weight: 700; flex-shrink: 0; }
        .prodigio-toast.success .t-icon { color: #10b981; }
        .prodigio-toast.error   .t-icon { color: #ef4444; }
        .prodigio-toast.info    .t-icon { color: #3b82f6; }
        .prodigio-toast .t-msg  { flex: 1; line-height: 1.4; }
        .prodigio-toast.success .t-msg { color: #065f46; }
        .prodigio-toast.error   .t-msg { color: #991b1b; }
        .prodigio-toast.info    .t-msg { color: #1e40af; }
    `;
    // Esperar a que head esté disponible
    if (document.head) {
        document.head.appendChild(style);
    } else {
        document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
    }
})();

// ── showToast (llamado desde Blazor via JSInterop) ───────────
window.showToast = function(message, type) {
    type = type || 'info';
    try {
        const container = getOrCreateToastContainer();

        const icons = { success: '✓', error: '✕', info: 'ℹ' };
        const toast = document.createElement('div');
        toast.className = `prodigio-toast ${type}`;
        toast.innerHTML = `
            <span class="t-icon">${icons[type] || 'ℹ'}</span>
            <span class="t-msg">${message}</span>
        `;
        container.appendChild(toast);

        // Animar entrada
        requestAnimationFrame(() => {
            requestAnimationFrame(() => toast.classList.add('visible'));
        });

        // Animar salida y eliminar
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 350);
        }, 3500);

    } catch (err) {
        // Fallback si algo falla con el DOM
        console.warn('[Prodigio] showToast falló, usando alert:', err);
        alert(message);
    }
};

// ── guardadoFacturaOk (confirmación visual de guardado) ──────
window.guardadoFacturaOk = function(numeroFactura) {
    window.showToast('✓ Factura ' + numeroFactura + ' guardada correctamente', 'success');
};

// ── generarPdfFactura ────────────────────────────────────────
window.generarPdfFactura = function(factura) {
    // Verificar que jsPDF esté cargado
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        window.showToast('⚠ La librería de PDF no está cargada. Verifica tu conexión e intenta de nuevo.', 'error');
        console.error('[Prodigio] jsPDF no está disponible en window.jspdf');
        return false;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'letter'   // 215.9 × 279.4 mm
        });

        const W = 215.9; // ancho de página
        const colorVerde  = [108, 156, 138];
        const colorGris   = [75, 85, 99];
        const colorClaro  = [248, 250, 252];
        const colorBorde  = [220, 229, 225];

        // ── ENCABEZADO ────────────────────────────────────────
        doc.setFillColor(...colorVerde);
        doc.rect(0, 0, W, 36, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('PRODIGIO TECNOLOGÍA', 14, 17);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Reparación y venta de equipos tecnológicos', 14, 25);

        // Número y fecha (derecha)
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('FAC-' + (factura.numeroFactura || ''), W - 14, 17, { align: 'right' });
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Fecha: ' + (factura.fechaEmision || ''), W - 14, 25, { align: 'right' });
        doc.text('Vence: ' + (factura.fechaVencimiento || ''), W - 14, 31, { align: 'right' });

        // ── DATOS DEL CLIENTE ─────────────────────────────────
        let y = 46;
        doc.setTextColor(...colorGris);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('DATOS DEL CLIENTE', 14, y);

        y += 6;
        doc.setFillColor(...colorClaro);
        doc.setDrawColor(...colorBorde);
        doc.roundedRect(14, y, W - 28, 36, 2, 2, 'FD');

        y += 7;
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.text('Nombre:', 20, y);
        doc.text('RNC/Cédula:', 110, y);
        doc.setFont('helvetica', 'normal');
        doc.text(factura.clienteNombre || '', 45, y);
        doc.text(factura.clienteRNC || '', 135, y);

        y += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('Teléfono:', 20, y);
        doc.text('Email:', 110, y);
        doc.setFont('helvetica', 'normal');
        doc.text(factura.clienteTel || '', 45, y);
        doc.text(factura.clienteEmail || '', 125, y);

        y += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('Dirección:', 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(factura.clienteDireccion || '', 45, y);

        // ── TABLA DE ARTÍCULOS ────────────────────────────────
        y += 16;
        doc.setFillColor(...colorVerde);
        doc.rect(14, y, W - 28, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.text('Descripción',  18,       y + 5.5);
        doc.text('Cant.',        130,      y + 5.5);
        doc.text('Precio Unit.', 148,      y + 5.5);
        doc.text('Total',        W - 18,   y + 5.5, { align: 'right' });

        y += 8;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colorGris);
        let subtotal = 0;

        const items = factura.items || [];
        items.forEach(function(item, idx) {
            const cant    = Number(item.cantidad)       || 0;
            const precio  = Number(item.precioUnitario) || 0;
            const linea   = cant * precio;
            subtotal += linea;

            if (idx % 2 === 0) {
                doc.setFillColor(...colorClaro);
                doc.rect(14, y - 4, W - 28, 7, 'F');
            }

            // Truncar descripción larga
            const desc = doc.splitTextToSize(item.descripcion || '', 100)[0] || '';
            doc.setFontSize(8);
            doc.text(desc,                                    18,       y);
            doc.text(cant.toString(),                         132,      y);
            doc.text('RD$ ' + precio.toLocaleString('es-DO', {minimumFractionDigits:2}), 150, y);
            doc.text('RD$ ' + linea.toLocaleString('es-DO',  {minimumFractionDigits:2}), W - 18, y, { align: 'right' });
            y += 7;
        });

        // ── TOTALES ───────────────────────────────────────────
        y += 4;
        const itbis = subtotal * 0.18;
        const total = subtotal + itbis;

        // Subtotal
        doc.setFillColor(...colorClaro);
        doc.setDrawColor(...colorBorde);
        doc.rect(130, y, W - 144, 6, 'FD');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colorGris);
        doc.text('Subtotal:', 134, y + 4.2);
        doc.text('RD$ ' + subtotal.toLocaleString('es-DO', {minimumFractionDigits:2}), W - 18, y + 4.2, { align: 'right' });

        // ITBIS
        y += 7;
        doc.setFillColor(...colorClaro);
        doc.rect(130, y, W - 144, 6, 'FD');
        doc.text('ITBIS (18%):', 134, y + 4.2);
        doc.text('RD$ ' + itbis.toLocaleString('es-DO', {minimumFractionDigits:2}), W - 18, y + 4.2, { align: 'right' });

        // TOTAL
        y += 7;
        doc.setFillColor(...colorVerde);
        doc.rect(130, y, W - 144, 9, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('TOTAL:', 134, y + 6);
        doc.text('RD$ ' + total.toLocaleString('es-DO', {minimumFractionDigits:2}), W - 18, y + 6, { align: 'right' });

        // ── NOTAS ─────────────────────────────────────────────
        if (factura.notas && factura.notas.trim()) {
            y += 16;
            doc.setTextColor(...colorGris);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text('Notas:', 14, y);
            y += 5;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            const notasLines = doc.splitTextToSize(factura.notas, W - 28);
            doc.text(notasLines, 14, y);
        }

        // ── PIE DE PÁGINA ─────────────────────────────────────
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setTextColor(160, 160, 160);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'italic');
        doc.text('Gracias por su confianza en Prodigio Tecnología', W / 2, pageHeight - 12, { align: 'center' });
        doc.text('WhatsApp: +1 (809) 555-0199', W / 2, pageHeight - 7, { align: 'center' });

        // ── GUARDAR ───────────────────────────────────────────
        const fileName = 'Factura_' + (factura.numeroFactura || 'TEMP') + '_' + new Date().toISOString().slice(0,10) + '.pdf';
        doc.save(fileName);

        return true;

    } catch (error) {
        console.error('[Prodigio] Error generando PDF:', error);
        window.showToast('Error al generar el PDF: ' + error.message, 'error');
        return false;
    }
};
