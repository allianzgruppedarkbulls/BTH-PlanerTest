// js/main.js - Korrigierter Event-Listener-Bereich

canvas.addEventListener('contextmenu', e => e.preventDefault());

canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panX) / zoom;
    const y = (e.clientY - rect.top - panY) / zoom;

    // 0. Wenn das Regner-Werkzeug aktiv ist -> Startpunkt für das Aufziehen setzen
    if (activeTool === 'place-sprinkler') {
        if (!window.activeSprinklerConfig) {
            alert("Bitte wähle zuerst im Regner-Menü Hersteller, Familie und Gehäuse aus!");
            return;
        }
        window.activeSprinklerDrag = {
            startX: x,
            startY: y,
            currentX: x,
            currentY: y
        };
        return;
    }

    // Canvas verschieben (Panning), wenn kein Werkzeug aktiv ist
    if (e.button === 0 && !activeTool) {
        isDragging = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
        return;
    }

    // 1. Prüfen, ob auf eine bereits bestehende Wasserquelle geklickt wurde
    let clickedWater = typeof waterSources !== 'undefined' ? waterSources.find(s => Math.hypot(s.x - x, s.y - y) < 20 / zoom) : null;
    if (clickedWater) {
        openWaterModal(clickedWater.id);
        return;
    }

    // 2. Wenn das Wasserquellen-Werkzeug aktiv ist -> neuen Punkt setzen
    if (activeTool === 'water-source') {
        if (typeof placeWaterSource === 'function') {
            placeWaterSource(x, y);
        }
        return;
    }

    // 3. Zeichen-Modus für Gebäude, Rasen, Beete
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

    // 4. Maßstab eichen
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
    } 
    // 5. Freie Kontrollmessung
    else if (activeTool === 'measure') {
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
