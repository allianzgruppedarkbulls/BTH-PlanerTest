/**
 * Bewässerungs-Produktkatalog & Berechnungs-Logik (BTH Planwerk)
 * Reines JavaScript – Vorbereitet für spätere Datenbank-Migration
 */

// 1. Komplette Datenbasis als JavaScript-Array (später: await loadCatalogFromDatabase())
const irrigationCatalog = [
    // Rotationsregner
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
    
    // Sonderregner / Streifen
    { art: "Sonderregner", hersteller: "Hunter", bez: "Seitenstreifen MPSS530", wMin: 0, wMax: 5.0, winkelMin: 0, winkelMax: 360, artNr: "450491", eltern: ["450480", "450481"] },
    { art: "Sonderregner", hersteller: "Hunter", bez: "Streifen rechts MPRCS515", wMin: 0, wMax: 5.0, winkelMin: 0, winkelMax: 360, artNr: "450492", eltern: ["450480", "450481"] },
    { art: "Sonderregner", hersteller: "Hunter", bez: "Streifen links MPLCS515", wMin: 0, wMax: 5.0, winkelMin: 0, winkelMax: 360, artNr: "450493", eltern: ["450480", "450481"] },
    
    // Aufsteiger / Gehäuse (Elternteile)
    { art: "Aufsteiger", hersteller: "Hunter", bez: "Gehäuse PROS-04-CV (15.5 cm)", wMin: 0, wMax: 0, winkelMin: 0, winkelMax: 0, artNr: "450480", eltern: [] },
    { art: "Aufsteiger", hersteller: "Hunter", bez: "Gehäuse PROS-12-CV (41.0 cm)", wMin: 0, wMax: 0, winkelMin: 0, winkelMax: 0, artNr: "450481", eltern: [] }
];

// 2. Kern-Automationslogik: Findet den passenden Artikel dynamisch nach Radius & Winkel
function resolveSprinklerFromCanvas(productFamily, targetRadiusMeters, targetAngleDeg) {
    // Filtere alle Artikel der gewidmeten Produktfamilie (keine Aufsteiger)
    const familyItems = irrigationCatalog.filter(i => i.art === productFamily && i.art !== "Aufsteiger");
    
    if (familyItems.length === 0) return null;

    // Suche das passendste Modell, dessen wMax am besten zum gezogenen Radius passt (aufsteigend sortiert)
    let suitableMatches = familyItems.filter(item => {
        const matchesAngle = (targetAngleDeg >= item.winkelMin && targetAngleDeg <= item.winkelMax) || (item.winkelMin === 360 && targetAngleDeg === 360);
        const matchesRadius = item.wMax >= targetRadiusMeters;
        return matchesRadius && matchesAngle;
    });

    // Falls exakt kein Modell den Radius abdeckt, nimm das Modell mit der größten Wurfweite dieser Familie
    if (suitableMatches.length === 0) {
        familyItems.sort((a, b) => b.wMax - a.wMax);
        suitableMatches = [familyItems[0]];
    } else {
        // Sortiere aufsteigend nach max. Radius, damit das kleinste passende Modell gewählt wird
        suitableMatches.sort((a, b) => a.wMax - b.wMax);
    }

    const selectedSprinkler = suitableMatches[0];

    // Automatische Eltern-Zuordnung (Gehäuse) auflösen
    const parentParts = selectedSprinkler.eltern.map(parentArtNr => {
        return irrigationCatalog.find(p => p.artNr === parentArtNr);
    }).filter(Boolean);

    return {
        sprinkler: selectedSprinkler,
        gehaeuse: parentParts[0] // Standardmäßig das erste passende Gehäuse (z.B. PROS-04-CV)
    };
}

// 3. UI-Integration: Regner-Werkzeug aktivieren (Arbeit mit Produktfamilien statt Einzelauswahl)
function activateRegnerTool() {
    console.log("Regner-Modul aktiv (Familien-Modus).");

    // Einzigartige Produktfamilien aus dem Katalog extrahieren
    const productFamilies = [...new Set(irrigationCatalog.filter(i => i.art !== "Aufsteiger").map(i => i.art))];

    let modal = document.getElementById('modal-regner-selection');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-regner-selection';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="min-width: 420px;">
                <h2>🎯 Regner-Familie wählen</h2>
                <p>Wählen Sie nur die Produktfamilie – das System ermittelt das passende Modell, die Düse und das Gehäuse automatisch beim Aufziehen auf dem Plan:</p>
                
                <div class="input-group" style="margin-bottom: 15px;">
                    <label>Produktfamilie</label>
                    <select id="regner-family-select" style="width: 100%; padding: 10px; background: #0b0f19; border: 1px solid var(--border-color); color: #fff; border-radius: 6px;">
                        <!-- Wird dynamisch gefüllt -->
                    </select>
                </div>

                <div class="input-group" style="margin-bottom: 15px;">
                    <label>Standard-Sektor / Winkel (Voreinstellung)</label>
                    <select id="regner-default-angle" style="width: 100%; padding: 10px; background: #0b0f19; border: 1px solid var(--border-color); color: #fff; border-radius: 6px;">
                        <option value="90">90° (Viertelkreis)</option>
                        <option value="180">180° (halbkreis)</option>
                        <option value="360" selected>360° (Vollkreis)</option>
                    </select>
                </div>

                <div class="button-row" style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
                    <button class="btn-back" onclick="closeRegnerModal()" style="padding: 10px 18px; background: #1f293d; color: #fff; border: none; border-radius: 6px; cursor: pointer;">Abbrechen</button>
                    <button class="btn-submit" onclick="confirmRegnerFamilySelection()" style="padding: 10px 18px; background: var(--accent-green, #10b981); color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer;">Platzieren starten</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const familySelect = document.getElementById('regner-family-select');
    familySelect.innerHTML = productFamilies.map(f => `<option value="${f}">${f}</option>`).join('');

    modal.classList.remove('hidden');
}

function closeRegnerModal() {
    const modal = document.getElementById('modal-regner-selection');
    if (modal) modal.classList.add('hidden');
}

// Wenn der Nutzer die Familie gewählt hat, startet der Zeichenmodus auf dem Canvas
function confirmRegnerFamilySelection() {
    const selectedFamily = document.getElementById('regner-family-select').value;
    const defaultAngle = parseInt(document.getElementById('regner-default-angle').value);
    
    closeRegnerModal();

    // Aktiviert den Regner-Zeichenmodus in der App
    activeTool = 'place-sprinkler';
    window.activeSprinklerConfig = {
        family: selectedFamily,
        angle: defaultAngle
    };

    alert(`Produktfamilie "${selectedFamily}" (${defaultAngle}°) gewählt.\nKlicken Sie auf den Plan und ziehen Sie den Radius auf – das System ermittelt den Artikel automatisch!`);
}
