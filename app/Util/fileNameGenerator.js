const { v4: uuidv4 } = require('uuid');

const generateFromFile = (file) => {
  return `${uuidv4()}_file.${file.extname}`;
};

module.exports = { generateFromFile };
