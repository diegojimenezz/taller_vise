const mongoose = require('mongoose');
const path = require('path');

// load project modules
const db = require(path.join(__dirname, '..', 'src', 'Data', 'db.js'));
const Client = require(path.join(__dirname, '..', 'src', 'models', 'clientModel.js'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vise';

async function seed() {
  console.log('Conectando a', MONGODB_URI);
  // Eliminamos las opciones obsoletas useNewUrlParser y useUnifiedTopology
  await mongoose.connect(MONGODB_URI);

  try {
    // Primero eliminamos todos los clientes existentes
    await Client.deleteMany({});
    
    // Insertamos los clientes con sus IDs predefinidos
    for (const c of db.initialSeed) {
      const clientData = {
        clientId: c.clientId,
        name: c.name,
        country: c.country,
        monthlyIncome: c.monthlyIncome,
        viseClub: c.viseClub,
        cardType: c.cardType,
        createdAt: new Date()
      };
      
      const client = new Client(clientData);
      await client.save();
      console.log('Inserted client with clientId:', clientData.clientId);
    }
  } catch (e) {
    console.error('Error al seed:', e);
    throw e;
  } finally {
    await mongoose.disconnect();
    console.log('Proceso finalizado');
  }
}

if (require.main === module) {
  seed().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { seed };