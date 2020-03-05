require("dotenv").config();
const request = require("request-promise");
const cheerio = require("cheerio");
const crypto = require("crypto");
const _ = require("lodash");
const { parseStudentMark, parseInputForm, parseStudentTimeTable, sortByDay } = require("./parseFunc");
const URL = "http://dkh.tlu.edu.vn/CMCSoft.IU.Web.info";
var $;

//create request
const requests = request.defaults({
  transform: body => {
    $ = cheerio.load(body);
    err_text = $("#lblErrorInfo").text();
    if (err_text && err_text.trim()) throw err_text;

    return $;
  },
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "max-age=0",
    Connection: "keep-alive",
    "Accept-Encoding": "gzip, deflate, br"
  },
  baseUrl: URL,
  jar: request.jar()
});

const login = async (username = '', password = '') => {
  await requests.get("/");
  await requests.get("/login.aspx");
  let formInput = parseInputForm($);
  
  if (username == '' && password == '') {
    username = process.env.DKH_USERNAME
    password = process.env.DKH_PASSWORD
  }
  

  formInput["txtUserName"] = username;
  formInput["txtPassword"] = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");
  await requests.post("/login.aspx", {
    form: formInput,
    simple: false
  });
};

const fetchAllMark = async () => {
  await requests.get("/StudentMark.aspx");

  return parseStudentMark($);
};
const fetchSemesterMark = async () => {
  await requests.get("/StudentMark.aspx");
  let form = parseInputForm($);
  let options_semester = $("#drpHK option");
  let studentMark = [];
  for (let index = 0; index < options_semester.length; index++) {
    const option = options_semester[index];
    form.drpHK = $(option).val();
    await requests.post("/StudentMark.aspx", {
      form
    });
    let markSemester = parseStudentMark($, {
      semesterCode: form.drpHK,
      semesterName: form.drpHK
    });
    studentMark.push(markSemester);
    form = parseInputForm($);
  }
  return studentMarkfetchSemesterMark;
};
const fetchStudentTimeTable = async () => {
  var studentTimeTable = []
  await requests.get("/Reports/Form/StudentTimeTable.aspx");
  var form = parseInputForm($);
  var firstSemester = $("#drpSemester option")
    .first()
    .val();
  var secondSemester = $("#drpSemester option")
    .next()
    .val();

  let options = $("#drpTerm option");
  for (let index = 0; index < options.length; index++) {
    let term = $(options[index]).val();
    //fetch data with term
    form.drpTerm = term;
    await requests.post("/Reports/Form/StudentTimeTable.aspx", { form });
    form = parseInputForm($);
    studentTimeTable = [...studentTimeTable, ...parseStudentTimeTable($) ]
  }
  studentTimeTable = [...studentTimeTable, ...parseStudentTimeTable($) ]

 
  //get term in second semester
  form.drpSemester = secondSemester;
  await requests.post("/Reports/Form/StudentTimeTable.aspx", { form });
  form = parseInputForm($);
  options = $("#drpTerm option");
  for (let index = 0; index < options.length; index++) {
    let term = $(options[index]).val();
    //fetch data with term
    form.drpTerm = term;
    await requests.post("/Reports/Form/StudentTimeTable.aspx", { form });
    form = parseInputForm($);
    studentTimeTable = [...studentTimeTable, ...parseStudentTimeTable($) ]
  }
 // console.log(studentTimeTable)
  return sortByDay(studentTimeTable)
};
const fetchInformation = async () => {
  await requests.get('/StudentViewExamList.aspx')
  let studentCode = $('#lblMaSinhVien').text()
  let yearLearn = $('#lblKhoaHoc').text()
  let studentClass = $('#lblLop').text()
  let studentName = $('#lblTenSinhVien').text()
  let studentMajors = $('#lblNganhHoc').text()

  return {
    studentCode, 
    studentName,
    studentClass,
    studentMajors,
    yearLearn
  }
  
}
module.exports = {
  login, 
  fetchAllMark,
  fetchSemesterMark,
  fetchStudentTimeTable,
  fetchInformation
}
