/**
 * Bewässerungs-Produktkatalog & Berechnungs-Logik (BTH Planwerk)
 * Inklusive halbautomatischer Gehäusewahl (Eltern-Teile) & flexibler Zuordnung
 */

// 1. Komplette Datenbasis als JavaScript-Array (später: await loadCatalogFromDatabase())
const irrigationCatalog = [
    // Rotationsregner (Kinder / Düsen)
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
    
    // Aufsteiger / Gehäuse (Elternteile / Vater-Teile mit 1/2" IG Anschluss)
    { art: "Aufsteiger", hersteller: "Hunter", bez: "Gehäuse PROS-04-CV (15.5 cm / 1/2\" IG)", wMin: 0, wMax: 0, winkelMin: 0, winkelMax: 0, artNr: "450480", eltern: [] },
    { art: "Aufsteiger", hersteller: "Hunter", bez: "Gehäuse PROS-12-CV (41.0 cm / 1/2\" IG - Hoch)", wMin: 0, wMax: 0, winkelMin: 0, winkelMax: 0, artNr: "450481", eltern: [] },
    { art: "Aufsteiger", hersteller: "Rain Bird", bez: "Gehäuse 1804-SAM (10 cm / 1/2\" IG - Universal)", wMin: 0, wMax: 0, winkelMin: 0, winkelMax: 0, artNr: "RB1804", eltern: [] }
];

// 2. Kern-Automationslogik: Ermittelt den Regner nach Radius und verknüpft das gewählte Vater-Teil
function resolveSprinklerFromCanvas(productFamily, targetRadiusMeters, targetAngleDeg, selectedParentArtNr) {
    const familyItems = irrigationCatalog.filter(i => i.art === productFamily && i.art !== "Aufsteiger");
    if (familyItems.length === 0) return null;

    let suitableMatches = familyItems.filter(item => {
        const matchesAngle = (targetAngleDeg >= item.winkelMin && targetAngleDeg <= item.winkelMax) || (item.winkelMin === 360 && targetAngleDeg === 360);
        const matchesRadius = item.wMax >= targetRadiusMeters;
        return matchesRadius && matchesAngle;
    });

    if (suitableMatches.length === 0) {
        familyItems.sort((a, b) => b.wMax - a.wMax);
        suitableMatches = [familyItems[0]];
    } else {
        suitableMatches.sort((a, b) => a.wMax - b.wMax);
    }

    const selectedSprinkler = suitableMatches[0];

    // Das vom Nutzer gewählte oder Standard-Vater-Teil (Gehäuse) zuordnen
    const parentGehaeuse = irrigationCatalog.find(p => p.artNr === selectedParentArtNr) || 
                           irrigationCatalog.find(p => p.artNr === selectedSprinkler.eltern[0]);

    return {
        sprinkler: selectedSprinkler,
        gehaeuse: parentGehaeuse
    };
}

// 3. UI-Integration: Auswahldialog mit Produktfamilien UND flexibler Gehäusewahl (Vater-Teile)
function activateRegnerTool() {
    console.log("Regner-Modul aktiv (Mit halbautomatischer Gehäusewahl).");

    const productFamilies = [...new Set(irrigationCatalog.filter(i => i.art !== "Aufsteiger").map(i => i.art))];
    const allGehaeuse = irrigationCatalog.filter(i => i.art === "Aufsteiger");

    let modal = document.getElementById('modal-regner-selection');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-regner-selection';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="min-width: 440px;">
                <h2>🎯 Regner & Gehäuse konfigurieren</h2>
                <p>Wählen Sie die Produktfamilie. Das Modell wird beim Aufziehen auf dem Plan automatisch ermittelt. Bestimmen Sie hier optional das bevorzugte Gehäuse (Vater-Teil):</p>
                
                <div class="input-group" style="margin-bottom: 12px;">
                    <label>Produktfamilie (Düsen-Typ)</label>
                    <select id="regner-family-select" style="width: 100%; padding: 10px; background: #0b0f19; border: 1px solid var(--border-color); color: #fff; border-radius: 6px;">
                        <!-- Wird dynamisch gefüllt -->
                    </select>
                </div>

                <div class="input-group" style="margin-bottom: 12px;">
                    <label>Standard-Sektor / Winkel</label>
                    <select id="regner-default-angle" style="width: 100%; padding: 10px; background: #0b0f19; border: 1px solid var(--border-color); color: #fff; border-radius: 6px;">
                        <option value="90">90° (Viertelkreis)</option>
                        <option value="180">180° (Halbkreis)</option>
                        <option value="360" selected>360° (Vollkreis)</option>
                    </select>
                </div>

                <div class="input-group" style="margin-bottom: 15px;">
                    <label>Bevorzugtes Gehäuse / Aufsteiger (Vater-Teil)</label>
                    <select id="regner-parent-select" style="width: 100%; padding: 10px; background: #0b0f19; border: 1px solid var(--border-color); color: #fff; border-radius: 6px;">
                        <!-- Wird dynamisch gefüllt -->
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

    document.getElementById('regner-family-select').innerHTML = productFamilies.map(f => `<option value="${f}">${f}</option>`).join('');
    document.getElementById('regner-parent-select').innerHTML = allGehaeuse.map(g => `<option value="${g.artNr}">${g.bez} (${g.hersteller})</option>`).join('');

    modal.classList.remove('hidden');
}

function closeRegnerModal() {
    const modal = document.getElementById('modal-regner-selection');
    if (modal) modal.classList.add('hidden');
}

function confirmRegnerFamilySelection() {
    const selectedFamily = document.getElementById('regner-family-select').value;
    const defaultAngle = parseInt(document.getElementById('regner-default-angle').value);
    const selectedParentArtNr = document.getElementById('regner-parent-select').value;
    
    closeRegnerModal();

    activeTool = 'place-sprinkler';
    window.activeSprinklerConfig = {
        family: selectedFamily,
        angle: defaultAngle,
        parentArtNr: selectedParentArtNr
    };

    alert(`Konfiguration aktiv:\n• Familie: ${selectedFamily} (${defaultAngle}°)\n• Gehäuse: Gewähltes Vater-Teil\n\nKlicken und Radius auf dem Plan aufziehen!`);
}
