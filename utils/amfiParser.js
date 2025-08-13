// Utility functions for parsing AMFI data

function parseRangeData(body) {
  const fundData = [];
  const bodyClean = body.replace(/\r?\n/g, "\n");
  const bodyArr = bodyClean.split("\n");
  const funds = bodyArr.map((str) => str.split(";"));
  const headers = funds[0];

  for (let i = 1; i < funds.length; i++) {
    if (funds[i].length === 8) {
      let obj = {};
      for (let j = 0; j < 8; j++) {
        if (j === 2 || j === 3 || j === 5 || j === 6) continue;
        obj[headers[j]] = funds[i][j];
      }
      fundData.push(obj);
    }
  }
  return fundData;
}

function parseData(body) {
  const fundData = [];
  const bodyClean = body.replace(/\r?\n/g, "\n");
  const bodyArr = bodyClean.split("\n");
  const funds = bodyArr.map((str) => str.split(";"));
  const headers = funds[0];

  for (let i = 1; i < funds.length; i++) {
    if (funds[i].length === 6) {
      let obj = {};
      for (let j = 0; j < 6; j++) obj[headers[j]] = funds[i][j];
      fundData.push(obj);
    }
  }
  return fundData;
}

module.exports = { parseRangeData, parseData };
