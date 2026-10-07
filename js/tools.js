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
