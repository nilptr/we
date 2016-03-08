
var cheerio = require('cheerio');

module.exports = parseMsg;

function parseMsg(xmlStr) {
  var msg = {};
  var $ = cheerio.load(xmlStr, {
    normalizeWhitespace: true,
    xmlMode: true
  });

  $('xml').children().each(function () {
    msg[normalize(this.tagName)] = $(this).text();
  });

  return msg;
}

function normalize(name) {
  name = name.replace(/(?:-|_)+(\w)/, function(all, letter) {
    return letter.toUpperCase();
  });
  return name[0].toLowerCase() + name.slice(1);
}