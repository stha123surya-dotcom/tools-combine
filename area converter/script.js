
// script.js
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
