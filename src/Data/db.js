// Seed data (clientes pre-registrados) para pruebas.
// Campos esperados por el servicio: { name, country, monthlyIncome, viseClub, cardType }
const initialSeed = [
  {
    clientId: 1,
    name: "Ana Gomez",
    country: "Colombia",
    monthlyIncome: 300,
    viseClub: false,
    cardType: "Classic"
  },
  {
    clientId: 2,
    name: "Luis Martinez",
    country: "USA",
    monthlyIncome: 600,
    viseClub: false,
    cardType: "Gold"
  },
  {
    clientId: 3,
    name: "María López",
    country: "Spain",
    monthlyIncome: 1500,
    viseClub: true,
    cardType: "Platinum"
  },
  {
    clientId: 4,
    name: "Carlos Ruiz",
    country: "Chile",
    monthlyIncome: 2500,
    viseClub: true,
    cardType: "Black"
  },
  {
    clientId: 5,
    name: "Sofia Torres",
    country: "Peru",
    monthlyIncome: 3000,
    viseClub: true,
    cardType: "White"
  }
];

const db = {
  clients: initialSeed.map(c => ({ ...c })),
  nextClientId: Math.max(...initialSeed.map(c => c.clientId)) + 1,
  // Re-aplica el seed inicial (útil para pruebas)
  seed() {
    this.clients = initialSeed.map(c => ({ ...c }));
    this.nextClientId = Math.max(...initialSeed.map(c => c.clientId)) + 1;
    return this.clients;
  }
};

module.exports = db;
