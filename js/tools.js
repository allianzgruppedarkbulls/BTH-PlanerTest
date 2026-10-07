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
    if (!pixelsPerMeter) { alert("⚠️ Bitte zuerst Maßstab eichen!"); return; }
    activeTool = 'measure';
    measurePoints = [];
    document.getElementById('btn-measure').classList.add('active-tool');
    alert("Mess-Modus aktiv.");
}
