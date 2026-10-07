function triggerFileUpload() { document.getElementById('file-input').click(); }

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                uploadedImage = img;
                redrawCanvas();
                alert("Plan erfolgreich geladen!");
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }
}


function activateScaleTool() {
    activeTool = 'scale';
    scalePoints = [];
    document.getElementById('btn-scale').classList.add('active-tool');
    alert("Eich-Modus: Klicken Sie auf zwei Punkte mit bekannter Länge.");
}

function activateMeasureTool() {
    activeTool = 'measure';
    measurePoints = [];
    document.getElementById('btn-measure').classList.add('active-tool');
    document.getElementById('btn-scale').classList.remove('active-tool');
}
// js/tools.js - Erweiterung für Wasserquellen und Eimertest

let waterSources = []; // Speichert alle platzierten Wasserpunkte

function activateWaterSourceTool() {
    activeTool = 'water-source';
    document.getElementById('btn-measure')?.classList.remove('active-tool');
    document.getElementById('btn-scale')?.classList.remove('active-tool');
}

// Wird beim Klick auf die Canvas im Modus 'water-source' aufgerufen
function placeWaterSource(x, y) {
    const newSource = {
        id: 'water_' + Date.now(),
        x: x,
        y: y,
        threadSize: '0.75', // Standard 3/4 Zoll
        threadType: 'ig',   // Innengewinde
        sourceType: 'tap',  // Hausanschluss ('tap') oder Zisterne/Brunnen ('cistern')
        pipeDiameterMm: 32, // Automatisch abgeleitet (bei 3/4" / 1" standardmäßig PE 32)
        flowTestDone: false,
        flowRateLpm: null,
        pressureBar: null
    };

    waterSources.push(newSource);
    activeTool = null; // Werkzeug nach Platzierung zurücksetzen
    redrawCanvas();
    
    // Direkt das Einstellungs-Modal für diesen neuen Punkt öffnen
    openWaterModal(newSource.id);
}

function openWaterModal(sourceId) {
    const source = waterSources.find(s => s.id === sourceId);
    if (!source) return;

    // Werte ins Modal schreiben
    document.getElementById('thread-size').value = source.threadSize;
    document.getElementById('thread-type').value = source.threadType;
    document.getElementById('source-type-select').value = source.sourceType;
    
    // Status des Eimertests im Modal anzeigen
    const testStatusEl = document.getElementById('modal-test-status');
    if (testStatusEl) {
        if (source.flowTestDone) {
            testStatusEl.innerHTML = `✅ Eimertest durchgeführt: ${source.flowRateLpm} L/min bei ${source.pressureBar} bar`;
            testStatusEl.style.color = 'var(--accent-green)';
        } else {
            testStatusEl.innerHTML = `⚠️ Eimertest ausstehend (jederzeit nachholbar)`;
            testStatusEl.style.color = 'var(--accent-yellow)';
        }
    }

    // ID im Modal hinterlegen zum Speichern
    document.getElementById('modal-startwater').setAttribute('data-active-id', sourceId);
    openModal('modal-startwater');
}

function saveWaterSourceFromModal() {
    const modal = document.getElementById('modal-startwater');
    const sourceId = modal.getAttribute('data-active-id');
    const source = waterSources.find(s => s.id === sourceId);

    if (source) {
        source.threadSize = document.getElementById('thread-size').value;
        source.threadType = document.getElementById('thread-type').value;
        source.sourceType = document.getElementById('source-type-select').value;
        
        // Rohrquerschnitt logisch ableiten (z.B. ab 1 Zoll oder Standard PE32)
        source.pipeDiameterMm = (source.threadSize === '1.0' || source.threadSize === '1.25') ? 32 : 25;
    }

    closeAllModals();
    redrawCanvas();
}

function openEimerTestModalFromWater() {
    // Schließt das Wasser-Modal kurz und öffnet den Eimertest
    closeAllModals();
    const sourceId = document.getElementById('modal-startwater').getAttribute('data-active-id');
    
    // Einfaches Prompt oder separates Modal für den Eimertest
    const lpm = prompt("Wassermenge beim Eimertest (Liter pro Minute, z.B. 25):", "25");
    if (lpm && !isNaN(lpm)) {
        const bar = prompt("Fließdruck in bar (geschätzt oder gemessen, z.B. 3.5):", "3.5");
        
        const source = waterSources.find(s => s.id === sourceId);
        if (source) {
            source.flowTestDone = true;
            source.flowRateLpm = parseFloat(lpm);
            source.pressureBar = parseFloat(bar || 3.0);
            alert("Eimertest erfolgreich hinterlegt!");
            redrawCanvas();
        }
    }
}
