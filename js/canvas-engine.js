function centerCanvas() {
    panX = (viewport.clientWidth - canvas.width) / 2;
    panY = (viewport.clientHeight - canvas.height) / 2;
    redrawCanvas();
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    if (uploadedImage) {
        ctx.drawImage(uploadedImage, 0, 0);
    } else {
        let gridMeters = zoom < 0.3 ? 20 : (zoom < 0.6 ? 10 : (zoom < 1.2 ? 5 : 1));
        let stepPx = pixelsPerMeter * gridMeters;

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.2 / zoom;

        const startCoord = -15000;
        const endCoord = 21000;

        for (let x = startCoord; x <= endCoord; x += stepPx) {
            ctx.beginPath(); ctx.moveTo(x, startCoord); ctx.lineTo(x, endCoord); ctx.stroke();
        }
        for (let y = startCoord; y <= endCoord; y += stepPx) {
            ctx.beginPath(); ctx.moveTo(startCoord, y); ctx.lineTo(endCoord, y); ctx.stroke();
        }

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2 / zoom;
        ctx.beginPath(); ctx.moveTo(0, startCoord); ctx.lineTo(0, endCoord); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(startCoord, 0); ctx.lineTo(endCoord, 0); ctx.stroke();
    }

    // Fertige Formen zeichnen
    shapes.forEach(shape => {
        ctx.beginPath();
        if (shape.points.length > 0) {
            ctx.moveTo(shape.points[0].x, shape.points[0].y);
            for (let i = 1; i < shape.points.length; i++) {
                let curr = shape.points[i];
                if (curr.rounded) {
                    ctx.quadraticCurveTo(curr.cx, curr.cy, curr.x, curr.y);
                } else {
                    ctx.lineTo(curr.x, curr.y);
                }
            }
            ctx.closePath();

            if (shape.type === 'building') { ctx.fillStyle = 'rgba(148, 163, 184, 0.35)'; ctx.strokeStyle = '#cbd5e1'; }
            else if (shape.type === 'lawn') { ctx.fillStyle = 'rgba(16, 185, 129, 0.25)'; ctx.strokeStyle = '#10b981'; }
            else if (shape.type === 'bed') { ctx.fillStyle = 'rgba(168, 85, 247, 0.25)'; ctx.strokeStyle = '#a855f7'; }

            ctx.fill();
            ctx.lineWidth = 2 / zoom;
            ctx.stroke();
        }
    });

    // Aktiver Zeichenpfad
    if (currentDrawingPoints.length > 0) {
        ctx.beginPath();
        ctx.moveTo(currentDrawingPoints[0].x, currentDrawingPoints[0].y);
        for (let i = 1; i < currentDrawingPoints.length; i++) {
            let curr = currentDrawingPoints[i];
            if (curr.rounded) {
                ctx.quadraticCurveTo(curr.cx, curr.cy, curr.x, curr.y);
            } else {
                ctx.lineTo(curr.x, curr.y);
            }
        }
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2 / zoom;
        ctx.stroke();

        currentDrawingPoints.forEach((pt) => {
            ctx.fillStyle = pt.rounded ? '#a855f7' : '#38bdf8';
            ctx.beginPath(); ctx.arc(pt.x, pt.y, 6 / zoom, 0, Math.PI * 2); ctx.fill();
        });
    }

    if (scalePoints.length === 2) {
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3 / zoom;
        ctx.beginPath(); ctx.moveTo(scalePoints[0].x, scalePoints[0].y); ctx.lineTo(scalePoints[1].x, scalePoints[1].y); ctx.stroke();
    }

    ctx.restore();
    document.getElementById('zoom-indicator').innerText = Math.round(zoom * 100) + '%';
}
