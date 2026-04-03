// Tab Switching Logic
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// --- Compass & Vastu Logic ---
const compass = document.getElementById('compass');
const directionText = document.getElementById('directionText');
const degreeText = document.getElementById('degreeText');
const statusRing = document.getElementById('statusRing');
const suggestionBox = document.getElementById('suggestionBox');
const roomSelect = document.getElementById('roomSelect');
const startBtn = document.getElementById('startBtn');

const vastuData = {
    "North": { best: ["living", "entrance", "pooja"], bad: ["bedroom", "septic", "overhead"] },
    "North-East": { best: ["pooja", "entrance", "underground"], bad: ["toilet", "kitchen", "septic", "staircase"] },
    "East": { best: ["living", "entrance", "dining"], bad: ["toilet", "septic"] },
    "South-East": { best: ["kitchen", "parking"], bad: ["underground", "pooja", "bedroom"] },
    "South": { best: ["bedroom", "staircase"], bad: ["underground", "pooja", "entrance"] },
    "South-West": { best: ["bedroom", "overhead", "store"], bad: ["entrance", "pooja", "underground", "septic"] },
    "West": { best: ["dining", "overhead", "toilet", "lift"], bad: ["pooja", "entrance"] },
    "North-West": { best: ["servant", "parking", "septic", "toilet"], bad: ["pooja", "bedroom"] }
};

function getDirection(deg) {
    if (deg >= 337.5 || deg < 22.5) return "North";
    if (deg >= 22.5 && deg < 67.5) return "North-East";
    if (deg >= 67.5 && deg < 112.5) return "East";
    if (deg >= 112.5 && deg < 157.5) return "South-East";
    if (deg >= 157.5 && deg < 202.5) return "South";
    if (deg >= 202.5 && deg < 247.5) return "South-West";
    if (deg >= 247.5 && deg < 292.5) return "West";
    if (deg >= 292.5 && deg < 337.5) return "North-West";
}

function updateVastu(dir) {
    const selectedRoom = roomSelect.value;
    const data = vastuData[dir];
    
    directionText.innerText = dir;
    
    let isGood = data.best.includes(selectedRoom);
    let isBad = data.bad.includes(selectedRoom);

    if (isGood) {
        statusRing.style.borderColor = "#2ecc71"; // Green
        statusRing.style.boxShadow = "0 0 20px rgba(46, 204, 113, 0.4)";
        suggestionBox.style.borderLeftColor = "#2ecc71";
        suggestionBox.innerText = `EXCELLENT: The ${dir} zone is highly recommended for ${selectedRoom}.`;
    } else if (isBad) {
        statusRing.style.borderColor = "#e74c3c"; // Red
        statusRing.style.boxShadow = "0 0 20px rgba(231, 76, 60, 0.4)";
        suggestionBox.style.borderLeftColor = "#e74c3c";
        suggestionBox.innerText = `AVOID: ${selectedRoom} in ${dir} is considered a major Vastu defect.`;
    } else {
        statusRing.style.borderColor = "#95a5a6"; // Grey
        statusRing.style.boxShadow = "none";
        suggestionBox.style.borderLeftColor = "#95a5a6";
        suggestionBox.innerText = `NEUTRAL: ${selectedRoom} in ${dir} is acceptable with minor adjustments.`;
    }
}

function initCompass() {
    // Standard Permission handling for iOS/Modern Browsers
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response == 'granted') {
                    window.addEventListener('deviceorientation', handler, true);
                    startBtn.style.display = 'none';
                }
            }).catch(e => alert("Please use a mobile device and enable sensors."));
    } else {
        window.addEventListener('deviceorientationabsolute', handler, true);
        startBtn.style.display = 'none';
    }
}

function handler(e) {
    // Check for webkit heading first (iOS), otherwise use alpha (Android)
    let heading = e.webkitCompassHeading || (360 - e.alpha);
    let rounded = Math.round(heading);
    
    // Rotate dial opposite to device movement
    compass.style.transform = `rotate(${-rounded}deg)`;
    degreeText.innerText = `${rounded}°`;
    
    const dir = getDirection(rounded);
    updateVastu(dir);
}

startBtn.addEventListener('click', initCompass);
roomSelect.addEventListener('change', () => {
    const currentDir = directionText.innerText;
    if(currentDir !== "North") updateVastu(currentDir);
});

// Area Converter
let count = 0;

function addTriangle() {
  const div = document.createElement('div');
  div.className = 'triangle';

  div.innerHTML = `
    <h4>Triangle ${count + 1}</h4>
    <input type="number" placeholder="A" step="any">
    <input type="number" placeholder="B" step="any">
    <input type="number" placeholder="C" step="any">
    <p>Area: <span class="area">0</span></p>
  `;

  document.getElementById('triangles').appendChild(div);

  div.querySelectorAll('input').forEach(i => i.addEventListener('input', calculate));

  count++;
}

addTriangle();

function calculate() {
  let total = 0;
  const unit = document.getElementById('unit').value;

  document.querySelectorAll('.triangle').forEach(tri => {
    const inputs = tri.querySelectorAll('input');
    const a = parseFloat(inputs[0].value) || 0;
    const b = parseFloat(inputs[1].value) || 0;
    const c = parseFloat(inputs[2].value) || 0;

    let area = 0;
    if (a && b && c) {
      const s = (a + b + c) / 2;
      area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }

    tri.querySelector('.area').innerText = area.toFixed(2);
    total += area;
  });

  let sqFt = unit === 'm' ? total * 10.7639 : total;
  let sqM = unit === 'ft' ? total * 0.092903 : total;

  document.getElementById('totalSq').innerText = `${sqM.toFixed(2)} Sq.m | ${sqFt.toFixed(2)} Sq.ft`;

  // Hill
  let ropani = Math.floor(sqFt / 5476);
  let rem = sqFt % 5476;
  let aana = Math.floor(rem / 342.25);
  rem %= 342.25;
  let paisa = Math.floor(rem / 85.56);
  rem %= 85.56;
  let dam = Math.floor(rem / 21.39);

  document.getElementById('nepaliHill').innerText =
    `🏔 ${ropani}R ${aana}A ${paisa}P ${dam}D`;

  // Terai
  let bigha = Math.floor(sqFt / 72900);
  rem = sqFt % 72900;
  let kattha = Math.floor(rem / 3645);
  rem %= 3645;
  let dhur = Math.floor(rem / 182.25);

  document.getElementById('nepaliTerai').innerText =
    `🌾 ${bigha}B ${kattha}K ${dhur}D`;
}

function resetAll() {
  document.getElementById('triangles').innerHTML = '';
  count = 0;
  addTriangle();
  calculate();
}

function exportPDF() {
  window.print();
}



///Quick Estimate

const roomData = {
    bedroom: { size: 120, label: "Bedroom" },
    toilet: { size: 36, label: "Toilet" },
    attachedToilet: { size: 33, label: "Attached Toilet" },
    staircase: { size: 97.5, label: "Staircase" },
    kitchenDining: { size: 195, label: "Kitchen Dining" },
    porch: { size: 168, label: "Porch" },
    balcony: { size: 18, label: "Balcony" },
    laundry: { size: 30, label: "Laundry" }
};

// GENERATE FLOORS
function generateFloors() {
    const count = document.getElementById("floorCount").value;
    const container = document.getElementById("floors-container");

    container.innerHTML = "";

    for (let i = 1; i <= count; i++) {

        let roomsHTML = "";

        for (let key in roomData) {
            roomsHTML += `
                <div class="room-box">
                    <label>${roomData[key].label}</label>
                    <span>${roomData[key].size} sq.ft</span>
                    <input type="number" min="0" value="0" 
                    id="${key}_${i}" oninput="calculateAll()">
                </div>
            `;
        }

        container.innerHTML += `
            <div class="floor">
                <h3>Floor ${i}</h3>
                <div class="room-grid">${roomsHTML}</div>
                <p class="floor-result">Area: 
                    <span id="floor${i}">0</span> sq.ft
                </p>
            </div>
        `;
    }

    calculateAll();
}

// CALCULATE
function calculateFloor(floor) {
    let total = 0;

    for (let key in roomData) {
        let val = parseInt(document.getElementById(`${key}_${floor}`)?.value) || 0;
        total += val * roomData[key].size;
    }

    total += total * 0.10; // lobby

    document.getElementById(`floor${floor}`).innerText = total.toFixed(0);

    return total;
}

function calculateAll() {
    const count = parseInt(document.getElementById("floorCount").value) || 1;
    let totalArea = 0;
    let totalCost = 0;

    const baseRate = parseFloat(document.getElementById("costType").value) || 0;

    for (let i = 1; i <= count; i++) {
        let floorArea = calculateFloor(i);
        totalArea += floorArea;

        // COST LOGIC
        let rateMultiplier = (i === 1) ? 1.5 : 1; // 1st floor = 1.5x
        let floorCost = floorArea * baseRate * rateMultiplier;

        totalCost += floorCost;
    }

    // UPDATE UI
    document.getElementById("totalArea").innerText =
        totalArea.toLocaleString() + " sq.ft";

    document.getElementById("totalCost").innerText =
        "Rs. " + Math.round(totalCost).toLocaleString();
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("floorCount").addEventListener("input", generateFloors);
    document.getElementById("costType").addEventListener("change", calculateAll);

    generateFloors();
});