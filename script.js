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
    "North-East": { best: ["pooja", "entrance", "underground"], bad: ["toilet", "kitchen", "septic"] },
    "East": { best: ["living", "entrance"], bad: ["toilet"] },
    "South-East": { best: ["kitchen"], bad: ["pooja", "bedroom"] },
    "South": { best: ["bedroom", "staircase"], bad: ["pooja", "entrance"] },
    "South-West": { best: ["bedroom", "overhead", "store"], bad: ["entrance", "pooja"] },
    "West": { best: ["dining", "toilet"], bad: ["pooja"] },
    "North-West": { best: ["parking", "septic", "toilet"], bad: ["pooja", "bedroom"] }
};

function updateVastu(dir) {
    const selectedRoom = roomSelect.value;
    const data = vastuData[dir];
    directionText.innerText = dir;
    
    let isGood = data.best.includes(selectedRoom);
    let isBad = data.bad.includes(selectedRoom);

    if (isGood) {
        statusRing.style.borderColor = "#2ecc71";
        suggestionBox.innerText = `EXCELLENT: ${dir} is perfect for ${selectedRoom}.`;
    } else if (isBad) {
        statusRing.style.borderColor = "#e74c3c";
        suggestionBox.innerText = `AVOID: ${selectedRoom} in ${dir} causes Vastu Dosh.`;
    } else {
        statusRing.style.borderColor = "#95a5a6";
        suggestionBox.innerText = `NEUTRAL: Acceptable location for ${selectedRoom}.`;
    }
}

function initCompass() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(response => {
            if (response == 'granted') {
                window.addEventListener('deviceorientation', handler, true);
                startBtn.style.display = 'none';
            }
        });
    } else {
        window.addEventListener('deviceorientationabsolute', handler, true);
        startBtn.style.display = 'none';
    }
}

function handler(e) {
    let heading = e.webkitCompassHeading || (360 - e.alpha);
    let rounded = Math.round(heading);
    compass.style.transform = `rotate(${-rounded}deg)`;
    degreeText.innerText = `${rounded}°`;
    
    // Calculate direction based on your segments
    let dir = "North";
    if (rounded >= 337.5 || rounded < 22.5) dir = "North";
    else if (rounded >= 22.5 && rounded < 67.5) dir = "North-East";
    else if (rounded >= 67.5 && rounded < 112.5) dir = "East";
    else if (rounded >= 112.5 && rounded < 157.5) dir = "South-East";
    else if (rounded >= 157.5 && rounded < 202.5) dir = "South";
    else if (rounded >= 202.5 && rounded < 247.5) dir = "South-West";
    else if (rounded >= 247.5 && rounded < 292.5) dir = "West";
    else if (rounded >= 292.5 && rounded < 337.5) dir = "North-West";
    
    updateVastu(dir);
}

startBtn.addEventListener('click', initCompass);


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

    total += total * 0.20; // lobby

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