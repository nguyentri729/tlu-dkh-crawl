require("dotenv").config();
const rp = require("request-promise");
const cheerio = require("cheerio");
const crypto = require("crypto");

const URL = "http://dkh.tlu.edu.vn/CMCSoft.IU.Web.info";
var $;

var cookie;
//create request
const request = async (endpoint, option = {}) => {
  let options = {
    uri: URL + endpoint,
    transform: body => {
      let $ = cheerio.load(body);

      return $;
    },
    jar: true,
    headers: {
      'Host': "dkh.tlu.edu.vn",
      "Cache-Control": " max-age=0",
      'Origin': "http://dkh.tlu.edu.vn",
      "Upgrade-Insecure-Requests": 1,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
      'Referer': URL,
      "Accept-Language": " en-US,en;q=0.9"
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
parseInputForm = () => {
  let form = $("form");
  let inputs = form.find("input");
  let data = {};
  inputs.each((i, ele) => {
    $(ele).val() ? (value = $(ele).val()) : (value = "");
    data[$(ele).attr("name")] = value;
  });
  return data;
};

login = async () => {
  await request("/login.aspx");
  let formInput = parseInputForm();
  formInput["txtUserName"] = process.env.DKH_USERNAME;
  formInput["txtPassword"] = crypto
    .createHash("md5")
    .update(process.env.DKH_PASSWORD)
    .digest("hex");
  await request("/login.aspx", {
    form: formInput,
    method: "POST"
  });
  // await request('/MarkAndView.aspx')

  // console.log($('body').html())
};
login();

debugger;
