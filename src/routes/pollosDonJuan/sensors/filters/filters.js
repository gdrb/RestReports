export function getFilter(receivedData) {
  switch (receivedData.type) {
    case "tempChange":
      return { result: true, response: getTempChangeFilter(receivedData) };
    case "noMoreChickensReset":
      return {
        result: true,
        response: getNoMoreChickensResetFilter(receivedData),
      };
    default:
      console.log(`tempFunctions => getFilter: received type is undefined`);
      return { result: false, error: `received type is undefined` };
  }
}

function getTempChangeFilter(receivedData) {
  return {
    $and: [
      { "datos.idFromTh": { $eq: `${receivedData.id}` } },
      { "datos.idToTh": { $eq: `${receivedData.id}` } },
      { "datos.type": `tempChange` },
      { "datos.processDateTime": { $gte: `${receivedData.inicio}` } },
      { "datos.processDateTime": { $lte: `${receivedData.fin}` } },
    ],
  };
}

function getNoMoreChickensResetFilter(receivedData) {
  return {
    $and: [
      { "datos.idFromTh": { $eq: `${receivedData.id}` } },
      { "datos.idToTh": { $eq: `${receivedData.id}` } },
      { "datos.type": `noMoreChickensReset` },
      { "datos.processDateTime": { $gte: `${receivedData.inicio}` } },
      { "datos.processDateTime": { $lte: `${receivedData.fin}` } },
    ],
  };
}
