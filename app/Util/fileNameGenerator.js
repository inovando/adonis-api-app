const generateFromFile = (file) => {
  const timeStamp = Math.round(new Date().getTime() / 1000);
  return `${timeStamp}_file.${file.subtype}`;
};

module.exports = { generateFromFile };
