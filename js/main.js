canvas.addEventListener('contextmenu', e => e.preventDefault());

viewport.addEventListener('mousedown', (e) => {
    if (e.button === 0 && !activeTool) {
        isDragging = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
    }
});


window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        redrawCanvas();
    }
});

window.addEventListener('mouseup', () => { isDragging = false; });

viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const prevZoom = zoom;
    zoom = e.deltaY < 0 ? zoom * (1 + zoomIntensity) : zoom / (1 + zoomIntensity);
    zoom = Math.max(0.01, Math.min(30.0, zoom));

    panX = mouseX - (mouseX - panX) * (zoom / prevZoom);
    panY = mouseY - (mouseY - panY) * (zoom / prevZoom);

    redrawCanvas();
}, { passive: false });

canvas.addEventListener('mousedown', function(e) {
    if (isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panX) / zoom;
    const y = (e.clientY - rect.top - panY) / zoom;

    if (activeTool && activeTool.startsWith('draw-')) {
        const isRightClick = (e.button === 2);
        let inserted = false;

        if (currentDrawingPoints.length >= 2) {
            for (let i = 0; i < currentDrawingPoints.length; i++) {
                let p1 = currentDrawingPoints[i];
                let p2 = currentDrawingPoints[(i + 1) % currentDrawingPoints.length];
                if (distToSegmentCheck(x, y, p1.x, p1.y, p2.x, p2.y) < 15 / zoom) {
                    currentDrawingPoints.splice(i + 1, 0, {
                        x: x, y: y,
                        rounded: isRightClick,
                        cx: (p1.x + x) / 2, cy: (p1.y + y) / 2
                    });
                    inserted = true;
                    break;
                }
            }
        }

        if (!inserted) {
            let prev = currentDrawingPoints[currentDrawingPoints.length - 1] || { x: x, y: y };
            currentDrawingPoints.push({
                x: x, y: y,
                rounded: isRightClick,
                cx: (prev.x + x) / 2,
                cy: (prev.y + y) / 2
            });
        }
        redrawCanvas();
        return;
    }

    if (activeTool === 'scale') {
        scalePoints.push({x, y});
        redrawCanvas();
        if (scalePoints.length === 2) {
            const pixelDist = Math.hypot(scalePoints[1].x - scalePoints[0].x, scalePoints[1].y - scalePoints[0].y);
            const realMeters = prompt("Realer Abstand in Metern (z.B. 10):", "10");
            if (realMeters && !isNaN(realMeters) && realMeters > 0) {
                pixelsPerMeter = pixelDist / parseFloat(realMeters);
                document.getElementById('scale-indicator').innerText = `${pixelsPerMeter.toFixed(1)} px/m`;
                alert(`Globaler Maßstab geeicht: ${pixelsPerMeter.toFixed(1)} Pixel/Meter.`);
            }
            activeTool = null;
            document.getElementById('btn-scale').classList.remove('active-tool');
            redrawCanvas();
        }
    } else if (activeTool === 'measure') {
        measurePoints.push({x, y});
        redrawCanvas();
        if (measurePoints.length === 2) {
            const pixelDist = Math.hypot(measurePoints[1].x - measurePoints[0].x, measurePoints[1].y - measurePoints[0].y);
            const realDist = (pixelDist / pixelsPerMeter).toFixed(2) + " m";
            document.getElementById('measure-result').innerText = realDist;
            alert(`Gemessener Abstand: ${realDist}`);
            activeTool = null;
            document.getElementById('btn-measure').classList.remove('active-tool');
        }
    }
});

function setWorkflowStep(step) {
    currentStep = step;
    document.getElementById('step1-status').innerText = step === 1 ? 'Aktiv' : '✔ Erledigt';
    document.getElementById('step2-status').innerText = step === 2 ? 'Aktiv' : (step > 2 ? '✔ Erledigt' : '🔒 Gesperrt');
    toggleGroupLock('group-step2', step !== 2);
    document.getElementById('btn-goto-step3').style.display = step === 2 ? 'block' : 'none';
}

function toggleGroupLock(groupId, lock) {
    document.getElementById(groupId).querySelectorAll('.tool-btn').forEach(btn => {
        lock ? btn.classList.add('locked') : btn.classList.remove('locked');
    });
}

function toggleAdminMode() {
    isAdmin = !isAdmin;
    document.getElementById('header-badge').innerText = isAdmin ? "Profi-Modus (Admin)" : "Privatkunden-Modus";
    document.getElementById('mode-indicator').innerText = isAdmin ? "Profi (Admin)" : "Privatkunde";
    document.getElementById('step3-status').innerText = isAdmin ? "Aktiv" : "🔒 GESPERRT";
    document.getElementById('step3-status').style.color = isAdmin ? "var(--accent-green)" : "var(--accent-red)";
    document.getElementById('group-step3').querySelectorAll('.tool-btn').forEach(btn => {
        isAdmin ? btn.classList.remove('locked') : btn.classList.add('locked');
    });
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function showGenericModal(title, text) {
    document.getElementById('generic-modal-title').innerText = title;
    document.getElementById('generic-modal-desc').innerText = text;
    document.getElementById('modal-generic').classList.remove('hidden');
}
function closeAllModals() { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden')); }
function handleProAction(name) {
    if (!isAdmin) { alert("🔒 Nur für Administratoren!"); return; }
    showGenericModal("Profi-Modus", `Aktion gestartet: ${name}`);
}

centerCanvas();
