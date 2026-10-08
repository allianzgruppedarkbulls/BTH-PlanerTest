/**
 * Bewässerungs-Produktkatalog, Handles & Berechnungs-Logik (BTH Planwerk)
 * 100% gekapselt im Regner-Modul
 */

const irrigationCatalog = [
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP800SR-90°", wMin: 0, wMax: 3.0, winkelMin: 90, winkelMax: 210, artNr: "450496", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP800SR-360°", wMin: 0, wMax: 3.0, winkelMin: 360, winkelMax: 360, artNr: "450497", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP815-90°", wMin: 0, wMax: 4.5, winkelMin: 90, winkelMax: 210, artNr: "450477", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP815-210°", wMin: 0, wMax: 4.5, winkelMin: 210, winkelMax: 270, artNr: "450478", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP815-360°", wMin: 0, wMax: 4.5, winkelMin: 360, winkelMax: 360, artNr: "450479", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP820-90°", wMin: 0, wMax: 6.7, winkelMin: 90, winkelMax: 210, artNr: "450467", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP820-210°", wMin: 0, wMax: 6.7, winkelMin: 210, winkelMax: 270, artNr: "450468", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP820-360°", wMin: 0, wMax: 6.7, winkelMin: 360, winkelMax: 360, artNr: "450469", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP1000-90°", wMin: 0, wMax: 4.1, winkelMin: 90, winkelMax: 210, artNr: "450482", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP1000-210°", wMin: 0, wMax: 4.1, winkelMin: 210, winkelMax: 270, artNr: "450483", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP1000-360°", wMin: 0, wMax: 4.1, winkelMin: 360, winkelMax: 360, artNr: "450484", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP2000-90°", wMin: 0, wMax: 5.8, winkelMin: 90, winkelMax: 210, artNr: "450485", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP2000-210°", wMin: 0, wMax: 5.8, winkelMin: 210, winkelMax: 270, artNr: "450486", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP2000-360°", wMin: 0, wMax: 5.8, winkelMin: 360, winkelMax: 360, artNr: "450487", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP3000-90°", wMin: 0, wMax: 9.1, winkelMin: 90, winkelMax: 210, artNr: "450488", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP3000-210°", wMin: 0, wMax: 9.1, winkelMin: 210, winkelMax: 270, artNr: "450489", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP3000-360°", wMin: 0, wMax: 9.1, winkelMin: 360, winkelMax: 360, artNr: "450490", eltern: ["450480", "450481"] },
    { art: "Rotationsregner", hersteller: "Hunter", bez: "MP3500-90°", wMin: 0, wMax: 10.7, winkelMin: 90, winkelMax: 210, artNr: "450498", eltern: ["450480", "450481"] },
    { art: "Sonderregner", hersteller: "Hunter", bez: "Seitenstreifen MPSS530", wMin: 0, wMax: 5.0, winkelMin: 0, winkelMax: 360, artNr: "450491", eltern: ["450480", "450481"] },
    { art: "Sonderregner", hersteller: "Hunter", bez: "Streifen rechts MPRCS515", wMin: 0, wMax: 5.0, winkelMin: 0, winkelMax: 360, artNr: "450492", eltern: ["450480", "450481"] },
    { art: "Sonderregner", hersteller: "Hunter", bez: "Streifen links MPLCS515", wMin: 0, wMax: 5.0, winkelMin: 0, winkelMax: 360, artNr: "450493", eltern: ["450480", "450481"] },
    { art: "Aufsteiger", hersteller: "Hunter", bez: "Gehäuse PROS-04-CV (15.5 cm / 1/2\" IG)", wMin: 0, wMax: 0, winkelMin: 0, winkelMax: 0, artNr: "450480", eltern: [] },
    { art: "Aufsteiger", hersteller: "Hunter", bez: "Gehäuse PROS-12-CV (41.0 cm / 1/2\" IG - Hoch)", wMin: 0, wMax: 0, winkelMin: 0, winkelMax: 0, artNr: "450481", eltern: [] },
    { art: "Aufsteiger", hersteller: "Rain Bird", bez: "Gehäuse 1804-SAM (10 cm / 1/2\" IG - Universal)", wMin: 0, wMax: 0, winkelMin: 0, winkelMax: 0, artNr: "RB1804", eltern: [] }
];

// Sicherstellen, dass sprinklers nur einmal global referenziert wird
if (typeof window.sprinklers === 'undefined') {
    window.sprinklers = [];
}
let sprinklers = window.sprinklers;

let activeSprinklerDrag = null;
let selectedSprinkler = null;

// 1. Katalog-Auflösung (mit Sortierung nach kleinstem Radius & Winkel)
function resolveSprinklerFromCanvas(targetManufacturer, productFamily, targetRadiusMeters, targetAngleDeg, selectedParentArtNr) {
    const familyItems = irrigationCatalog.filter(i => i.hersteller === targetManufacturer && i.art === productFamily && i.art !== "Aufsteiger");
    if (familyItems.length === 0) return null;

    let suitableMatches = familyItems.filter(item => {
        const matchesAngle = (targetAngleDeg >= item.winkelMin && targetAngleDeg <= item.winkelMax) || (item.winkelMin === 360 && targetAngleDeg === 360);
        const matchesRadius = item.wMax >= targetRadiusMeters;
        return matchesRadius && matchesAngle;
    });

    if (suitableMatches.length === 0) {
        familyItems.sort((a, b) => a.wMax - b.wMax);
        suitableMatches = [familyItems[0]];
    } else {
        suitableMatches.sort((a, b) => {
            if (a.wMax !== b.wMax) return a.wMax - b.wMax;
            return a.winkelMin - b.winkelMin;
        });
    }

    const selectedSprinklerItem = suitableMatches[0];
    const parentGehaeuse = irrigationCatalog.find(p => p.artNr === selectedParentArtNr) || 
                           irrigationCatalog.find(p => p.artNr === selectedSprinklerItem.eltern[0]);

    return { sprinkler: selectedSprinklerItem, gehaeuse: parentGehaeuse };
}

// 2. Handle-Berechnung für das interaktive Ziehen
function getSprinklerHandles(s) {
    const rPx = s.radiusPx || (s.radiusMeters * (window.pixelsPerMeter || 40));
    const startRad = ((s.startAngle || 0) * Math.PI) / 180;
    const endRad = (((s.startAngle || 0) + (s.angleDeg || 360)) * Math.PI) / 180;
    const midRad = startRad + (((s.angleDeg || 360) * Math.PI) / 360);

    return {
        startHandle: { x: s.x + Math.cos(startRad) * rPx, y: s.y + Math.sin(startRad) * rPx },
        endHandle: { x: s.x + Math.cos(endRad) * rPx, y: s.y + Math.sin(endRad) * rPx },
        radiusHandle: { x: s.x + Math.cos(midRad) * rPx, y: s.y + Math.sin(midRad) * rPx }
    };
}

// 3. Modul-Renderfunktion (wird direkt vom Canvas-Engine aufgerufen)
function drawSprinklersModule(ctx, zoom) {
    if (typeof sprinklers === 'undefined') return;

    sprinklers.forEach(s => {
        ctx.save();
        ctx.translate(s.x, s.y);

        const rPx = s.radiusPx || (s.radiusMeters * (window.pixelsPerMeter || 40));
        const startRad = ((s.startAngle || 0) * Math.PI) / 180;
        const endRad = (((s.startAngle || 0) + (s.angleDeg || 360)) * Math.PI) / 180;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, rPx, startRad, endRad);
        ctx.closePath();
        ctx.fillStyle = (s === selectedSprinkler) ? 'rgba(0, 173, 181, 0.35)' : 'rgba(56, 189, 248, 0.15)';
        ctx.fill();
        ctx.strokeStyle = (s === selectedSprinkler) ? '#00adb5' : '#38bdf8';
        ctx.lineWidth = 2 / zoom;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 6 / zoom, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2 / zoom;
        ctx.stroke();

        ctx.font = `${10 / zoom}px sans-serif`;
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(s.resolvedData ? s.resolvedData.sprinkler.bez : 'Regner', 0, -12 / zoom);

        if (s === selectedSprinkler) {
            const h = getSprinklerHandles(s);
            ctx.lineWidth = 1.5 / zoom;

            ctx.beginPath(); ctx.arc(h.startHandle.x - s.x, h.startHandle.y - s.y, 7 / zoom, 0, Math.PI * 2);
            ctx.fillStyle = '#f1c40f'; ctx.fill(); ctx.stroke();

            ctx.beginPath(); ctx.arc(h.endHandle.x - s.x, h.endHandle.y - s.y, 7 / zoom, 0, Math.PI * 2);
            ctx.fillStyle = '#2ecc71'; ctx.fill(); ctx.stroke();

            ctx.beginPath(); ctx.arc(h.radiusHandle.x - s.x, h.radiusHandle.y - s.y, 7 / zoom, 0, Math.PI * 2);
            ctx.fillStyle = '#e74c3c'; ctx.fill(); ctx.stroke();
        }

        ctx.restore();
    });

    // Aktives Aufziehen in Echtzeit
    if (activeSprinklerDrag) {
        ctx.save();
        ctx.translate(activeSprinklerDrag.startX, activeSprinklerDrag.startY);
        const radiusPx = Math.hypot(activeSprinklerDrag.currentX - activeSprinklerDrag.startX, activeSprinklerDrag.currentY - activeSprinklerDrag.startY);
        
        ctx.beginPath();
        ctx.arc(0, 0, radiusPx, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2 / zoom;
        ctx.stroke();
        ctx.restore();
    }
}

// 4. UI & Tool-Aktivierung
function activateRegnerTool() {
    window.activeTool = 'place-sprinkler';
    const manufacturers = [...new Set(irrigationCatalog.filter(i => i.art !== "Aufsteiger").map(i => i.hersteller))];
    const productFamilies = [...new Set(irrigationCatalog.filter(i => i.art !== "Aufsteiger").map(i => i.art))];
    const allGehaeuse = irrigationCatalog.filter(i => i.art === "Aufsteiger");

    let modal = document.getElementById('modal-regner-selection');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-regner-selection';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="min-width: 440px;">
                <h2>🎯 Regner & Hersteller wählen</h2>
                <p>Wählen Sie Hersteller und Produktfamilie. Radius und Sektor werden beim Aufziehen automatisch ermittelt:</p>
                <div class="input-group" style="margin-bottom: 12px;">
                    <label>Hersteller / Marke</label>
                    <select id="regner-manufacturer-select" style="width: 100%; padding: 10px; background: #0b0f19; border: 1px solid var(--border-color); color: #fff; border-radius: 6px;"></select>
                </div>
                <div class="input-group" style="margin-bottom: 12px;">
                    <label>Produktfamilie</label>
                    <select id="regner-family-select" style="width: 100%; padding: 10px; background: #0b0f19; border: 1px solid var(--border-color); color: #fff; border-radius: 6px;"></select>
                </div>
                <div class="input-group" style="margin-bottom: 15px;">
                    <label>Bevorzugtes Gehäuse / Aufsteiger</label>
                    <select id="regner-parent-select" style="width: 100%; padding: 10px; background: #0b0f19; border: 1px solid var(--border-color); color: #fff; border-radius: 6px;"></select>
                </div>
                <div class="button-row" style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
                    <button class="btn-back" onclick="closeRegnerModal()" style="padding: 10px 18px; background: #1f293d; color: #fff; border: none; border-radius: 6px; cursor: pointer;">Abbrechen</button>
                    <button class="btn-submit" onclick="confirmRegnerFamilySelection()" style="padding: 10px 18px; background: var(--accent-green, #10b981); color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer;">Platzieren starten</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById('regner-manufacturer-select').innerHTML = manufacturers.map(m => `<option value="${m}">${m}</option>`).join('');
    document.getElementById('regner-family-select').innerHTML = productFamilies.map(f => `<option value="${f}">${f}</option>`).join('');
    document.getElementById('regner-parent-select').innerHTML = allGehaeuse.map(g => `<option value="${g.artNr}">${g.bez} (${g.hersteller})</option>`).join('');
    modal.classList.remove('hidden');
}

function closeRegnerModal() {
    document.getElementById('modal-regner-selection')?.classList.add('hidden');
}

function confirmRegnerFamilySelection() {
    window.activeSprinklerConfig = {
        manufacturer: document.getElementById('regner-manufacturer-select').value,
        family: document.getElementById('regner-family-select').value,
        parentArtNr: document.getElementById('regner-parent-select').value
    };
    closeRegnerModal();
    window.activeTool = 'place-sprinkler';
    alert("Bereit zum Zeichnen: Ziehen Sie den Regner auf dem Plan auf!");
}
