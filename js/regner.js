/**
 * Bewässerungs-Produktkatalog & Berechnungs-Logik
 * Reines JavaScript für die Einbindung in deine Web-App / Google Apps Script
 */

// 1. Komplette Datenbasis als JavaScript-Array
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
    { art: "Sonderregner", hersteller: "Hunter", bez: "Düsen Ecke", wMin: 0, wMax: 5.0, winkelMin: 0, winkelMax: 360, artNr: "450495", eltern: ["450480", "450481"] },
    
    // Aufsteiger (Gehäuse - Elternteile für das automatische Mapping)
    { art: "Aufsteiger", hersteller: "Hunter", bez: "Gehäuse PROS-04-CV (15.5 cm)", wMin: 0, wMax: 0, winkelMin: 0, winkelMax: 0, artNr: "450480", eltern: [] },
    { art: "Aufsteiger", hersteller: "Hunter", bez: "Gehäuse PROS-12-CV (41.0 cm)", wMin: 0, wMax: 0, winkelMin: 0, winkelMax: 0, artNr: "450481", eltern: [] }
];

// 2. Filter- und Suchfunktion für den Regner-Rechner
function findMatchingSprinklers(targetArt, targetRadius, targetAngle) {
    return irrigationCatalog.filter(item => {
        // Aufsteiger ignorieren (da sie nur Elternteile sind)
        if (item.art === "Aufsteiger") return false;
        
        // Nach Art filtern (falls angegeben)
        if (targetArt && targetArt !== "alle" && item.art !== targetArt) return false;
        
        // Nach Wurfweite filtern
        if (targetRadius !== null && item.wMax < targetRadius) return false;
        
        // Nach Winkel filtern
        if (targetAngle !== null && (targetAngle < item.winkelMin || targetAngle > item.winkelMax)) return false;

        return true;
    });
}

// 3. Hilfsfunktion zur Auflösung der Elternteile (Gehäuse) für die Stückliste
function getParentPartsForSprinkler(sprinklerArtNr) {
    const sprinkler = irrigationCatalog.find(item => item.artNr === sprinklerArtNr);
    if (!sprinkler || !sprinkler.eltern) return [];

    // Gibt alle passenden Gehäuse-Objekte zurück
    return sprinkler.eltern.map(parentArtNr => {
        return irrigationCatalog.find(p => p.artNr === parentArtNr);
    }).filter(p => p !== undefined);
}

// 4. Dynamisches Auswahl-UI für den Regner-Button (Automatische Dropdowns aus dem Katalog)
function activateRegnerTool() {
    console.log("Regner-Modul aktiv. Generiere Auswahldialog...");

    // Einzigartige Typen (art) und Hersteller aus dem Katalog extrahieren (ohne Aufsteiger)
    const availableTypes = [...new Set(irrigationCatalog.filter(i => i.art !== "Aufsteiger").map(i => i.art))];
    const availableBrands = [...new Set(irrigationCatalog.filter(i => i.art !== "Aufsteiger").map(i => i.hersteller))];

    // Prüfen, ob bereits ein Regner-Modal existiert, sonst erstellen
    let modal = document.getElementById('modal-regner-selection');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-regner-selection';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="min-width: 400px;">
                <h2>🎯 Regner-Auswahl & Konfiguration</h2>
                <p>Wählen Sie die Komponenten aus dem aktiven Katalog:</p>
                
                <div class="input-group" style="margin-bottom: 12px;">
                    <label>Regner-Art</label>
                    <select id="regner-type-select" style="width: 100%; padding: 8px; background: #0b0f19; border: 1px solid var(--border-color); color: #fff; border-radius: 4px;" onchange="updateRegnerModelDropdown()">
                        <!-- Wird dynamisch gefüllt -->
                    </select>
                </div>

                <div class="input-group" style="margin-bottom: 12px;">
                    <label>Hersteller / Marke</label>
                    <select id="regner-brand-select" style="width: 100%; padding: 8px; background: #0b0f19; border: 1px solid var(--border-color); color: #fff; border-radius: 4px;">
                        <!-- Wird dynamisch gefüllt -->
                    </select>
                </div>

                <div class="input-group" style="margin-bottom: 12px;">
                    <label>Modell / bez</label>
                    <select id="regner-model-select" style="width: 100%; padding: 8px; background: #0b0f19; border: 1px solid var(--border-color); color: #fff; border-radius: 4px;">
                        <!-- Wird dynamisch nach Typ gefüllt -->
                    </select>
                </div>

                <div class="button-row" style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
                    <button class="btn-back" onclick="closeRegnerModal()" style="padding: 8px 16px; background: #1f293d; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Abbrechen</button>
                    <button class="btn-submit" onclick="applySelectedRegner()" style="padding: 8px 16px; background: var(--accent-green, #10b981); color: #000; font-weight: bold; border: none; border-radius: 4px; cursor: pointer;">Regner übernehmen</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Dropdowns befüllen
    const typeSelect = document.getElementById('regner-type-select');
    typeSelect.innerHTML = availableTypes.map(t => `<option value="${t}">${t}</option>`).join('');

    const brandSelect = document.getElementById('regner-brand-select');
    brandSelect.innerHTML = availableBrands.map(b => `<option value="${b}">${b}</option>`).join('');

    updateRegnerModelDropdown();

    // Modal anzeigen
    modal.classList.remove('hidden');
}

// Hilfsfunktion: Modelle basierend auf gewählter Art aktualisieren
function updateRegnerModelDropdown() {
    const selectedType = document.getElementById('regner-type-select').value;
    const modelSelect = document.getElementById('regner-model-select');
    
    const matchingModels = irrigationCatalog.filter(i => i.art === selectedType);
    modelSelect.innerHTML = matchingModels.map(m => `<option value="${m.artNr}">${m.bez} (max. ${m.wMax}m)</option>`).join('');
}

// Modal schließen
function closeRegnerModal() {
    const modal = document.getElementById('modal-regner-selection');
    if (modal) modal.classList.add('hidden');
}

// Auswahl bestätigen und in die Planung übernehmen
function applySelectedRegner() {
    const modelArtNr = document.getElementById('regner-model-select').value;
    const selectedSprinkler = irrigationCatalog.find(i => i.artNr === modelArtNr);
    
    if (selectedSprinkler) {
        console.log("Ausgewählter Regner:", selectedSprinkler);
        // Hier werden später Gehäuse (Elternteile) automatisch aufgelöst
        const parentGehaeuse = getParentPartsForSprinkler(modelArtNr);
        console.log("Automatisch zugeordnete Gehäuse (Eltern):", parentGehaeuse);

        alert(`Erfolgreich gewählt: ${selectedSprinkler.bez}\nInklusive ${parentGehaeuse.length} passender Gehäuse-Optionen für die Stückliste!`);
    }
    
    closeRegnerModal();
}
