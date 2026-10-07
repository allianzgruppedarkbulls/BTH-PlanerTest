// js/drawing.js - Ergänzung für Flächen- und Gebäudezeichnung

function startDrawing(type) {
    activeShapeType = type;
    activeTool = 'draw-' + type;
    currentDrawingPoints = [];
    
    const modeInfo = document.getElementById('drawing-mode-info');
    if (modeInfo) {
        let typeName = 'Gebäude';
        if (type === 'lawn') typeName = 'Rasenfläche';
        if (type === 'bed') typeName = 'Beetfläche';
        modeInfo.innerText = `Zeichne: ${typeName}`;
    }
    
    const toolbar = document.getElementById('drawing-toolbar');
    if (toolbar) toolbar.classList.add('active');
}

function undoLastPoint() {
    if (currentDrawingPoints.length > 0) {
        currentDrawingPoints.pop();
        redrawCanvas();
    }
}

function finishCurrentShape() {
    if (currentDrawingPoints.length < 3) {
        alert("Eine geschlossene Fläche benötigt mindestens 3 Punkte!");
        return;
    }
    
    shapes.push({
        id: 'shape_' + Date.now(),
        type: activeShapeType,
        points: [...currentDrawingPoints],
        properties: {
            areaSqm: calculatePolygonArea(currentDrawingPoints)
        }
    });
    
    cancelDrawing();
    redrawCanvas();
}

function cancelDrawing() {
    activeTool = null;
    activeShapeType = null;
    currentDrawingPoints = [];
    const toolbar = document.getElementById('drawing-toolbar');
    if (toolbar) toolbar.classList.remove('active');
    redrawCanvas();
}

// Hilfsfunktion zur Flächenberechnung in Quadratmetern (basierend auf Pixel/Meter)
function calculatePolygonArea(pts) {
    let area = 0;
    let n = pts.length;
    for (let i = 0; i < n; i++) {
        let j = (i + 1) % n;
        area += pts[i].x * pts[j].y;
        area -= pts[j].x * pts[i].y;
    }
    area = Math.abs(area) / 2.0;
    // Umrechnung von Pixel^2 in Meter^2
    let sqm = area / (pixelsPerMeter * pixelsPerMeter);
    return sqm.toFixed(1);
}

function distToSegmentCheck(px, py, x1, y1, x2, y2) {
    let A = px - x1, B = py - y1, C = x2 - x1, D = y2 - y1;
    let dot = A * C + B * D;
    let lenSq = C * C + D * D;
    let param = lenSq !== 0 ? dot / lenSq : -1;
    let xx, yy;
    if (param < 0) { xx = x1; yy = y1; }
    else if (param > 1) { xx = x2; yy = y2; }
    else { xx = x1 + param * C; yy = y1 + param * D; }
    return Math.hypot(px - xx, py - yy);
}
