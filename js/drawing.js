function startDrawing(type) {
    activeShapeType = type;
    activeTool = 'draw-' + type;
    currentDrawingPoints = [];
    document.getElementById('drawing-toolbar').classList.add('active');
    document.getElementById('drawing-mode-info').innerText = `Zeichne: ${type === 'building' ? 'Gebäude' : (type === 'lawn' ? 'Rasenfläche' : 'Beetfläche')}`;
    alert("Zeichnen aktiv: Linksklick für kantige Ecken, Rechtsklick für gerundete Kurven.");
}

function undoLastPoint() {
    if (currentDrawingPoints.length > 0) {
        currentDrawingPoints.pop();
        redrawCanvas();
    }
}

function finishCurrentShape() {
    if (currentDrawingPoints.length < 3) {
        alert("Eine Fläche benötigt mindestens 3 Punkte!");
        return;
    }
    shapes.push({ type: activeShapeType, points: [...currentDrawingPoints] });
    cancelDrawing();
    redrawCanvas();
    alert("Fläche erfolgreich gespeichert!");
}

function cancelDrawing() {
    activeTool = null;
    activeShapeType = null;
    currentDrawingPoints = [];
    document.getElementById('drawing-toolbar').classList.remove('active');
    redrawCanvas();
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
