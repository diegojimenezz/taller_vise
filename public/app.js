document.addEventListener('DOMContentLoaded', () => {
  const btnLoad = document.getElementById('btnLoad');
  const clientsDiv = document.getElementById('clients');
  const statusDiv = document.getElementById('status');
  const purchaseForm = document.getElementById('purchaseForm');
  const purchaseStatusDiv = document.getElementById('purchaseStatus');
  const purchasesDiv = document.getElementById('purchases');
  const purchasesStatusDiv = document.getElementById('purchasesStatus');
  const btnLoadPurchases = document.getElementById('btnLoadPurchases');
  const mainContent = document.getElementById('mainContent');
  const purchasesSection = document.getElementById('purchases-section');
  const btnShowCreateClient = document.getElementById('btnShowCreateClient');
  const createClientSection = document.getElementById('create-client-section');
  const createClientForm = document.getElementById('createClientForm');
  const createClientStatusDiv = document.getElementById('createClientStatus');

  // Set today's date as default for purchaseDate input
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('purchaseDate').value = today;

  // Función para mostrar mensajes de estado con estilos apropiados
  function showStatusMessage(element, message, type = 'info') {
    element.textContent = message;
    element.className = 'status-message ' + type;
    
    // Remover el mensaje después de 5 segundos para mensajes de éxito
    if (type === 'success') {
      setTimeout(() => {
        element.textContent = '';
        element.className = 'status-message';
      }, 5000);
    }
  }

  // Función para crear una tarjeta de cliente
  function createClientCard(client) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div><strong>clientId:</strong> ${client.clientId}</div>
      <div><strong>name:</strong> ${client.name}</div>
      <div><strong>cardType:</strong> ${client.cardType}</div>
      <div><strong>status:</strong> ${client.status || 'Registered'}</div>
      <div><strong>message:</strong> ${client.message || 'Cliente apto para tarjeta ' + client.cardType}</div>
    `;
    return card;
  }

  // Función para crear una tarjeta de compra
  function createPurchaseCard(purchase) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div><strong>purchaseId:</strong> ${purchase.purchaseId || purchase._id || ''}</div>
      <div><strong>clientId:</strong> ${purchase.clientId}</div>
      <div><strong>originalAmount:</strong> ${purchase.originalAmount} ${purchase.currency || ''}</div>
      <div><strong>discountApplied:</strong> ${purchase.discountApplied}</div>
      <div><strong>finalAmount:</strong> ${purchase.finalAmount} ${purchase.currency || ''}</div>
      <div><strong>benefit:</strong> ${purchase.benefit || ''}</div>
    `;
    return card;
  }

  async function fetchClients() {
    showStatusMessage(statusDiv, 'Cargando clientes...', 'info');
    clientsDiv.innerHTML = '';
    try {
      const res = await fetch('/clients');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        showStatusMessage(statusDiv, 'Respuesta inesperada', 'error');
        return;
      }

      showStatusMessage(statusDiv, `Clientes cargados: ${data.length}`, 'success');

      data.forEach(client => {
        const card = createClientCard(client);
        clientsDiv.appendChild(card);
      });
    } catch (err) {
      showStatusMessage(statusDiv, 'Error: ' + err.message, 'error');
    }
  }

  async function fetchPurchases() {
    // Ocultar el contenido principal y mostrar solo el historial de compras
    hideAllSections();
    purchasesSection.style.display = 'block';
    
    showStatusMessage(purchasesStatusDiv, 'Cargando compras...', 'info');
    purchasesDiv.innerHTML = '';
    try {
      const res = await fetch('/purchases');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Handle both old format (array) and new format (object with status and purchases)
      const purchases = Array.isArray(data) ? data : (data.purchases || []);
      const status = Array.isArray(data) ? 'success' : data.status;

      if (!Array.isArray(purchases)) {
        showStatusMessage(purchasesStatusDiv, 'Respuesta inesperada', 'error');
        return;
      }

      // Mostrar mensaje si no hay compras
      if (purchases.length === 0) {
        showStatusMessage(purchasesStatusDiv, '', 'info'); // Limpiar mensaje de estado
        const noPurchasesMessage = document.createElement('div');
        noPurchasesMessage.className = 'no-purchases-message';
        noPurchasesMessage.textContent = 'No se han realizado compras';
        purchasesDiv.appendChild(noPurchasesMessage);
        return;
      }

      showStatusMessage(purchasesStatusDiv, `Compras cargadas: ${purchases.length}`, 'success');

      purchases.forEach(purchase => {
        const card = createPurchaseCard(purchase);
        purchasesDiv.appendChild(card);
      });
    } catch (err) {
      showStatusMessage(purchasesStatusDiv, 'Error: ' + err.message, 'error');
    }
  }

  // Función para ocultar todas las secciones
  function hideAllSections() {
    mainContent.style.display = 'none';
    purchasesSection.style.display = 'none';
    createClientSection.style.display = 'none';
  }

  // Función para mostrar el contenido principal (clientes y formulario)
  function showMainContent() {
    hideAllSections();
    mainContent.style.display = 'flex';
  }

  // Función para mostrar el formulario de creación de clientes
  function showCreateClientForm() {
    hideAllSections();
    createClientSection.style.display = 'block';
  }

  async function createClient(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const name = document.getElementById('clientName').value;
    const country = document.getElementById('clientCountry').value;
    const monthlyIncome = parseFloat(document.getElementById('clientMonthlyIncome').value);
    const viseClub = document.getElementById('clientViseClub').value === 'true';
    const cardType = document.getElementById('clientCardType').value;

    // Validación básica
    if (!name || !country || isNaN(monthlyIncome)) {
      showStatusMessage(createClientStatusDiv, 'Por favor, complete todos los campos', 'error');
      return;
    }

    // Crear objeto cliente con la estructura correcta
    const clientData = {
      name: name,
      country: country,
      monthlyIncome: monthlyIncome,
      viseClub: viseClub,
      cardType: cardType
    };

    showStatusMessage(createClientStatusDiv, 'Creando cliente...', 'info');

    try {
      const res = await fetch('/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });

      const data = await res.json();

      if (res.ok) {
        showStatusMessage(createClientStatusDiv, `Cliente creado exitosamente: ${data.name || data.data.name}`, 'success');
        // Limpiar el formulario
        createClientForm.reset();
        // Volver a mostrar el contenido principal y actualizar la lista de clientes
        setTimeout(() => {
          showMainContent();
          fetchClients();
        }, 2000);
      } else {
        showStatusMessage(createClientStatusDiv, `Error: ${data.error}`, 'error');
      }
    } catch (err) {
      showStatusMessage(createClientStatusDiv, 'Error: ' + err.message, 'error');
    }
  }

  async function makePurchase(event) {
    event.preventDefault();

    // Validación básica del formulario
    const clientId = parseInt(document.getElementById('clientId').value, 10);
    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;
    const purchaseDate = document.getElementById('purchaseDate').value;
    const purchaseCountry = document.getElementById('purchaseCountry').value;

    if (!clientId || !amount || !currency || !purchaseDate || !purchaseCountry) {
      showStatusMessage(purchaseStatusDiv, 'Por favor, complete todos los campos', 'error');
      return;
    }

    if (amount <= 0) {
      showStatusMessage(purchaseStatusDiv, 'El monto debe ser mayor que cero', 'error');
      return;
    }

    showStatusMessage(purchaseStatusDiv, 'Procesando compra...', 'info');

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
        showStatusMessage(purchaseStatusDiv, `Compra aprobada: ${data.purchase.benefit}`, 'success');
        // Limpiar el formulario después de una compra exitosa
        purchaseForm.reset();
        document.getElementById('purchaseDate').value = today;
      } else {
        showStatusMessage(purchaseStatusDiv, `Compra rechazada: ${data.error}`, 'error');
      }
    } catch (err) {
      showStatusMessage(purchaseStatusDiv, 'Error: ' + err.message, 'error');
    }
  }

  // Agregar eventos
  btnLoad.addEventListener('click', function() {
    showMainContent();
    fetchClients();
  });
  
  purchaseForm.addEventListener('submit', makePurchase);
  btnLoadPurchases.addEventListener('click', fetchPurchases);
  btnShowCreateClient.addEventListener('click', showCreateClientForm);
  createClientForm.addEventListener('submit', createClient);
  
  // Cargar clientes automáticamente al iniciar la página
  fetchClients();
});