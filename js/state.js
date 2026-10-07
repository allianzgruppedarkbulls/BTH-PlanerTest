const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');
const viewport = document.getElementById('viewport-div');

let currentStep = 1;
let isAdmin = false;
let uploadedImage = null;
let activeTool = null; // 'scale', 'measure', 'draw-building', etc.

let zoom = 1.0;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

let scalePoints = [];
let pixelsPerMeter = 40;
let measurePoints = [];

let shapes = []; 
let currentDrawingPoints = []; 
let activeShapeType = null;
