export const getService = (endpointId) => {
  switch (parseInt(endpointId)) {
    case 1:
    case 2:
    case 3:
    case 4:
      return "/payments-service";
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return "/accounts-service";
    case 10:
    case 11:
    case 12:
    case 13:
    case 14:
      return "/exchange-service";
    default:
      return "";
  }
};
