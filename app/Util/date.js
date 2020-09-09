const { format, formatDistanceToNow } = require('date-fns');
const locale = require('date-fns/locale/pt-BR');

function formatDate(isoString, formatString = 'P') {
  return format(isoString, formatString, { locale });
}

function formatHumanizedDate(firstDate) {
  return formatDistanceToNow(firstDate, { addSuffix: true, locale });
}

module.exports = {
  formatDate,
  formatHumanizedDate,
};
