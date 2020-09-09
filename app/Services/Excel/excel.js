const SpreadSheet = use('SpreadSheet');
const Helpers = use('Helpers');
const XLSX = require('xlsx');

const generateFromCollection = async (
  headers = [],
  rows,
  fileName = 'RELATORIO_SEM_NOME',
  nomeAba = 'ABA_SEM_NOME',
  response,
) => {
  const ss = new SpreadSheet(response, 'xlsx');
  const fileExcel = [headers, ...rows];
  ss.addSheet(nomeAba, fileExcel);
  ss.download(`${fileName}_${+new Date()}`);
  return ss;
};

const readFile = (file, sheetTable = 'PRECO_PRODUTOS') => {
  if (!file) {
    throw Error('Arquivo não informado');
  }

  if (!sheetTable) {
    throw Error('Aba não informada');
  }

  const pathFile = Helpers.tmpPath(file);
  const workbook = XLSX.readFile(pathFile);
  const rows = XLSX.utils.sheet_to_row_object_array(
    workbook.Sheets[sheetTable],
  );
  return rows;
};

module.exports = { generateFromCollection, readFile };
