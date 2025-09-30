const calculateDiscount = (purchase, client) => {
  const { amount, date, country } = purchase;
  const { cardType, country: clientCountry } = client;
  const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  let rate = 0;
  let reason = '';

  switch (cardType) {
    case "Classic":
      rate = 0;
      reason = '';
      break;

    case "Gold":
      if ([1, 2, 3].includes(dayOfWeek) && amount > 100) {
        rate = 0.15;
        reason = 'Lun-Mié-Vie';
      }
      break;

    case "Platinum":
      if ([1, 2, 3].includes(dayOfWeek) && amount > 100) {
        rate = 0.20;
        reason = 'Lun-Mié-Vie';
      } else if (dayOfWeek === 6 && amount > 200) {
        rate = 0.30;
        reason = 'Sábado';
      } else if (country !== clientCountry) {
        rate = 0.05;
        reason = 'Compra internacional';
      }
      break;

    case "Black":
      if ([1, 2, 3].includes(dayOfWeek) && amount > 100) {
        rate = 0.25;
        reason = 'Lun-Mié-Vie';
      } else if (dayOfWeek === 6 && amount > 200) {
        rate = 0.35;
        reason = 'Sábado';
      } else if (country !== clientCountry) {
        rate = 0.05;
        reason = 'Compra internacional';
      }
      break;

    case "White":
      if ([1, 2, 3, 4, 5].includes(dayOfWeek) && amount > 100) {
        rate = 0.25;
        reason = 'Lun-Vie';
      } else if ([0, 6].includes(dayOfWeek) && amount > 200) {
        rate = 0.35;
        reason = 'Fin de semana';
      } else if (country !== clientCountry) {
        rate = 0.05;
        reason = 'Compra internacional';
      }
      break;

    default:
      throw new Error("Tipo de tarjeta no válido");
  }

  return { rate, reason };
};
module.exports = calculateDiscount;