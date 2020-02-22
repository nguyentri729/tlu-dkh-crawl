require("dotenv").config();
const rp = require("request-promise");
const cheerio = require("cheerio");
const URL = "http://dkh.tlu.edu.vn/CMCSoft.IU.Web.info";
var $;
//create request 
const request = async (endpoint, option) => {
  let options = {
    uri: URL + endpoint,
    transform: body => {
      return cheerio.load(body);
    },
    ...option
  };
  await rp(options)
    .then(result => {
      $ = result;
    })
    .catch(err => {
      throw err;
    });
};

