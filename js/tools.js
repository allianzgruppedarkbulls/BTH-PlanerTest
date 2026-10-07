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

    document.getElementById('thread-size').value = source.threadSize || '0.75';
    document.getElementById('source-type-select').value = source.sourceType || 'tap';
    document.getElementById('pump-model-select').value = source.pumpModel || 'none';
    
    document.getElementById('input-flow-lpm').value = source.flowRateLpm || '';
    document.getElementById('input-pressure-bar').value = source.pressureBar || '';

    const testStatusEl = document.getElementById('modal-test-status');
    if (testStatusEl) {
        if (source.flowTestDone) {
            testStatusEl.innerHTML = `✅ Eimertest hinterlegt: ${source.flowRateLpm} L/min bei ${source.pressureBar} bar`;
            testStatusEl.style.color = '#10b981';
        } else {
            testStatusEl.innerHTML = `⚠️ Eimertest ausstehend`;
            testStatusEl.style.color = '#f59e0b';
        }
    }

    document.getElementById('modal-startwater').setAttribute('data-active-id', sourceId);
    openModal('modal-startwater');
}

function saveWaterSourceFromModal() {
    const modal = document.getElementById('modal-startwater');
    const sourceId = modal.getAttribute('data-active-id');
    const source = waterSources.find(s => s.id === sourceId);

    if (source) {
        source.threadSize = document.getElementById('thread-size').value;
        source.sourceType = document.getElementById('source-type-select').value;
        source.pumpModel = document.getElementById('pump-model-select').value;
        
        const lpmVal = document.getElementById('input-flow-lpm').value;
        const barVal = document.getElementById('input-pressure-bar').value;

        if (lpmVal && barVal && !isNaN(lpmVal) && !isNaN(barVal)) {
            source.flowRateLpm = parseFloat(lpmVal);
            source.pressureBar = parseFloat(barVal);
            source.flowTestDone = true;
        }

        // Rohrquerschnitt automatisch mappen (ab 1 Zoll standardmäßig PE 32)
        source.pipeDiameterMm = (source.threadSize === '1.0' || source.threadSize === '1.25') ? 32 : 25;
    }

    closeAllModals();
    redrawCanvas();
}
