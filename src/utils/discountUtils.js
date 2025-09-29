const calculateDiscount = (purchase, client) => {
  const { amount, date, country } = purchase;
  const { cardType, country: clientCountry } = client;
  const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  let discount = 0;

  switch (cardType) {
    case "Classic":
      discount = 0;
      break;

    case "Gold":
      if ([1, 2, 3].includes(dayOfWeek) && amount > 100) {
        discount = 0.15;
      }
      break;

    case "Platinum":
      if ([1, 2, 3].includes(dayOfWeek) && amount > 100) {
        discount = 0.20;
      } else if (dayOfWeek === 6 && amount > 200) {
        discount = 0.30;
      } else if (country !== clientCountry) {
        discount = 0.05;
      }
      break;

    case "Black":
      if ([1, 2, 3].includes(dayOfWeek) && amount > 100) {
        discount = 0.25;
      } else if (dayOfWeek === 6 && amount > 200) {
        discount = 0.35;
      } else if (country !== clientCountry) {
        discount = 0.05;
      }
      break;

    case "White":
      if ([1, 2, 3, 4, 5].includes(dayOfWeek) && amount > 100) {
        discount = 0.25;
      } else if ([0, 6].includes(dayOfWeek) && amount > 200) {
        discount = 0.35;
      } else if (country !== clientCountry) {
        discount = 0.05;
      }
      break;

    default:
      throw new Error("Tipo de tarjeta no válido");
  }

  return discount;
};

module.exports = calculateDiscount;