// Sistema de Toasts/Notificaciones
window.showToast = function(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    document.body.appendChild(container);
    return container;
}

// Estilos para toasts (inyectados dinámicamente)
const style = document.createElement('style');
style.innerHTML = `
    .toast {
        background: white;
        border-radius: 8px;
        padding: 16px 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.3s ease;
        min-width: 300px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
    }
    
    .toast.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .toast-success {
        background: #ecfdf5;
        border-left: 4px solid #10b981;
    }
    
    .toast-success .toast-icon {
        color: #10b981;
        font-weight: bold;
        font-size: 18px;
    }
    
    .toast-success .toast-message {
        color: #059669;
    }
    
    .toast-error {
        background: #fef2f2;
        border-left: 4px solid #ef4444;
    }
    
    .toast-error .toast-icon {
        color: #ef4444;
        font-weight: bold;
        font-size: 18px;
    }
    
    .toast-error .toast-message {
        color: #dc2626;
    }
    
    .toast-info {
        background: #eff6ff;
        border-left: 4px solid #3b82f6;
    }
    
    .toast-info .toast-icon {
        color: #3b82f6;
        font-weight: bold;
        font-size: 18px;
    }
    
    .toast-info .toast-message {
        color: #1d4ed8;
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;
document.head.appendChild(style);

// Generador de PDF para facturas (jsPDF)
window.generarPdfFactura = function(factura) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'letter'
        });

        // Configuración de colores
        const colorPrimario = [110, 150, 120]; // Verde Prodigio
        const colorGris = [75, 85, 99];
        const colorLigero = [248, 250, 252];

        // ENCABEZADO
        doc.setFillColor(...colorPrimario);
        doc.rect(0, 0, 216, 35, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('PRODIGIO TECNOLOGÍA', 14, 18);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Reparación y venta de equipos tecnológicos', 14, 25);

        // Número de factura (derecha)
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`FAC-${factura.numeroFactura}`, 150, 18);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha: ${factura.fechaEmision}`, 150, 26);

        // DATOS DEL CLIENTE
        let yPos = 45;
        doc.setTextColor(...colorGris);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('DATOS DEL CLIENTE', 14, yPos);

        yPos += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Nombre: ${factura.clienteNombre}`, 14, yPos);
        yPos += 6;
        doc.text(`RNC/Cédula: ${factura.clienteRNC}`, 14, yPos);
        yPos += 6;
        doc.text(`Teléfono: ${factura.clienteTel}`, 14, yPos);
        yPos += 6;
        doc.text(`Email: ${factura.clienteEmail}`, 14, yPos);
        yPos += 6;
        doc.text(`Dirección: ${factura.clienteDireccion}`, 14, yPos);

        // TABLA DE ARTÍCULOS
        yPos += 12;
        doc.setFillColor(...colorPrimario);
        doc.rect(14, yPos, 182, 8, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Descripción', 18, yPos + 6);
        doc.text('Cant.', 120, yPos + 6);
        doc.text('Precio Unit.', 145, yPos + 6);
        doc.text('Total', 180, yPos + 6);

        yPos += 8;
        doc.setTextColor(...colorGris);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);

        let subtotal = 0;
        factura.items.forEach((item, idx) => {
            const itemTotal = item.cantidad * item.precioUnitario;
            subtotal += itemTotal;

            // Fondo alterno
            if (idx % 2 === 0) {
                doc.setFillColor(248, 250, 252);
                doc.rect(14, yPos - 4, 182, 6, 'F');
            }

            doc.text(item.descripcion, 18, yPos);
            doc.text(item.cantidad.toString(), 120, yPos);
            doc.text(`RD$ ${item.precioUnitario.toFixed(2)}`, 145, yPos);
            doc.text(`RD$ ${itemTotal.toFixed(2)}`, 180, yPos);

            yPos += 6;
        });

        // TOTALES
        yPos += 4;
        doc.setFillColor(...colorLigero);
        doc.rect(120, yPos, 76, 5, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('Subtotal:', 125, yPos + 3.5);
        doc.text(`RD$ ${subtotal.toFixed(2)}`, 170, yPos + 3.5);

        yPos += 7;
        const itbis = subtotal * 0.18;
        doc.setFillColor(...colorLigero);
        doc.rect(120, yPos, 76, 5, 'F');
        doc.text('ITBIS (18%):', 125, yPos + 3.5);
        doc.text(`RD$ ${itbis.toFixed(2)}`, 170, yPos + 3.5);

        yPos += 7;
        const total = subtotal + itbis;
        doc.setFillColor(...colorPrimario);
        doc.rect(120, yPos, 76, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('TOTAL:', 125, yPos + 5);
        doc.text(`RD$ ${total.toFixed(2)}`, 170, yPos + 5);

        // NOTAS
        if (factura.notas) {
            yPos += 15;
            doc.setTextColor(...colorGris);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text('Notas:', 14, yPos);
            yPos += 5;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            const notasLines = doc.splitTextToSize(factura.notas, 180);
            doc.text(notasLines, 14, yPos);
        }

        // FOOTER
        yPos = 270;
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text('Gracias por su confianza en Prodigio Tecnología', 108, yPos, { align: 'center' });
        doc.text('www.prodigiotecnologia.com | WhatsApp: +1 (809) 555-0199', 108, yPos + 5, { align: 'center' });

        // DESCARGAR
        const fileName = `Factura_${factura.numeroFactura}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);

        return true;
    } catch (error) {
        console.error('Error generando PDF:', error);
        return false;
    }
};

