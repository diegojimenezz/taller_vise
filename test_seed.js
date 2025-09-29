const mongoose = require('mongoose');
const path = require('path');

// load project modules
const db = require(path.join(__dirname, 'src', 'Data', 'db.js'));
const Client = require(path.join(__dirname, 'src', 'models', 'clientModel.js'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vise';

async function testSeed() {
  console.log('Conectando a', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  try {
    // Primero eliminamos todos los clientes existentes
    await Client.deleteMany({});
    
    // Insertamos un cliente de prueba
    const testClient = {
      clientId: 999,
      name: 'Test Client',
      country: 'Test Country',
      monthlyIncome: 1000,
      viseClub: true,
      cardType: 'Gold',
      createdAt: new Date()
    };
    
    console.log('Datos del cliente a insertar:', testClient);
    
    const client = new Client(testClient);
    console.log('Documento antes de guardar:', client);
    
    const savedClient = await client.save();
    console.log('Documento después de guardar:', savedClient);
    
    // Verificamos que se haya guardado correctamente
    const foundClient = await Client.findOne({ clientId: 999 });
    console.log('Documento encontrado en la base de datos:', foundClient);
    
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
    console.log('Conexión cerrada');
  }
}

testSeed().catch(err => {
  console.error(err);
  process.exit(1);
});