document.addEventListener('DOMContentLoaded', () => {
  const btnLoad = document.getElementById('btnLoad');
  const btnSeed = document.getElementById('btnSeed');
  const clientsDiv = document.getElementById('clients');
  const statusDiv = document.getElementById('status');
  const purchaseForm = document.getElementById('purchaseForm');
  const purchaseStatusDiv = document.getElementById('purchaseStatus');

  async function fetchClients() {
    statusDiv.textContent = 'Cargando clientes...';
    clientsDiv.innerHTML = '';
    try {
      const res = await fetch('/clients');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        statusDiv.textContent = 'Respuesta inesperada';
        return;
      }

      statusDiv.textContent = `Clientes cargados: ${data.length}`;

      data.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div><strong>clientId:</strong>${c.clientId}</div>
          <div><strong>name:</strong> ${c.name}</div>
          <div><strong>cardType:</strong> ${c.cardType}</div>
          <div><strong>status:</strong> ${c.status || 'Registered'}</div>
          <div><strong>message:</strong> ${c.message || 'Cliente apto para tarjeta ' + c.cardType}</div>
        `;
        clientsDiv.appendChild(card);
      });
    } catch (err) {
      statusDiv.textContent = 'Error: ' + err.message;
    }
  }

  async function seed() {
    statusDiv.textContent = 'Reseteando datos...';
    try {
      const res = await fetch('/seed');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      statusDiv.textContent = `Seed aplicado: ${json.seededCount} clientes`;
      fetchClients();
    } catch (err) {
      statusDiv.textContent = 'Error: ' + err.message;
    }
  }

  async function makePurchase(event) {
    event.preventDefault();

    const clientId = parseInt(document.getElementById('clientId').value, 10);
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;
    const purchaseDate = document.getElementById('purchaseDate').value;
    const purchaseCountry = document.getElementById('purchaseCountry').value;

    purchaseStatusDiv.textContent = 'Procesando compra...';

    try {
      const res = await fetch('/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, amount, currency, purchaseDate, purchaseCountry })
      });

      const data = await res.json();

      console.log("Datos enviados:", { clientId, amount, currency, purchaseDate, purchaseCountry });
      console.log("Respuesta del servidor:", data);

      if (res.ok) {
        purchaseStatusDiv.textContent = `Compra aprobada: ${data.purchase.benefit}`;
      } else {
        purchaseStatusDiv.textContent = `Compra rechazada: ${data.error}`;
      }
    } catch (err) {
      purchaseStatusDiv.textContent = 'Error: ' + err.message;
    }
  }

  btnLoad.addEventListener('click', fetchClients);
  btnSeed.addEventListener('click', seed);
  purchaseForm.addEventListener('submit', makePurchase);
});
