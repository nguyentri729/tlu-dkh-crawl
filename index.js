require("dotenv").config();
const request = require("request-promise");
const cheerio = require("cheerio");
const crypto = require("crypto");
const _ = require("lodash");
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

parseInputForm = () => {
  let str = "";
  let form = $("form");
  let inputs = form.find("input");
  let data = {};
  inputs.each((i, ele) => {
    $(ele).val() ? (value = $(ele).val()) : (value = "");
    data[$(ele).attr("name")] = value;
    str += $(ele).attr("name") + "=" + value + ";";
  });
  let selects = form.find("select option:selected");

  selects.each((i, elem) => {
    if (
      $(elem)
        .parent()
        .attr("name")
    )
      data[
        $(elem)
          .parent()
          .attr("name")
      ] = $(elem).val();
  });
  //select form

  return data;
};

login = async () => {
  await requests.get("/");
  await requests.get("/login.aspx");
  let formInput = parseInputForm();
  formInput["txtUserName"] = process.env.DKH_USERNAME;
  formInput["txtPassword"] = crypto
    .createHash("md5")
    .update(process.env.DKH_PASSWORD)
    .digest("hex");
  await requests.post("/login.aspx", {
    form: formInput,
    simple: false
  });
};
parseStudentMark = (semester = {}) => {
  let studentMark = [];
  let trTable = $("#tblStudentMark")
    .find("tbody")
    .find("tr");

  trTable.each((i, elem) => {
    studentMark[i] = [];

    let tdTable = $(elem).find("td");
    tdTable.each((index, td) => {
      return (studentMark[i][index] = $(td).text());
    });
  });
  //delete data of header & footer in table
  delete studentMark[0];
  delete studentMark[studentMark.length - 1];

  //format to same dkhsv.tlu.edu.vn data constructor

  let studentMarkFormated = [];
  studentMark.forEach((marks, index) => {
    let [
      stt,
      subjectCode,
      subjectName,
      numberOfCredit,
      studyTime,
      timeThi,
      rowExam,
      isCounted,
      isAccepted,
      msv,
      markQT,
      markTHI,
      mark,
      charMark
    ] = marks;
    studentMarkFormated[index] = {
      charMark,
      mark,
      subject: {
        subjectCode,
        subjectName,
        numberOfCredit
      },
      semester,
      details: [
        {
          coeffiecient: 0,
          mark: markQT
        },
        {
          coeffiecient: 0,
          mark: markTHI
        }
      ],
      isAccepted,
      isCounted,
      studyTime,
      timeThi
    };
    //delete null object
    if (studentMarkFormated[index] == null) {
      delete studentMarkFormated[index];
    }
  });

  //Get mark of year
  let markYearTable = $("#grdResult tbody tr td");
  //console.log(markYearTable.length)
  let markYear = [];
  let index = 0;
  let markYearFor = [];
  for (let i = 14; i < markYearTable.length; i++) {
    markYearFor.push(
      $(markYearTable[i])
        .text()
        .trim()
    );
    if ((i + 1) % 14 === 0) {
      index++;
      if (index >= 1) {
        markYear.push({
          semester:
            markYearFor[1] === "Cả Năm" || markYearFor[0] === "Toàn khóa"
              ? markYearFor[0]
              : markYearFor[0] + "_" + markYearFor[1],
          tbtl: markYearFor[4],
          tbc: markYearFor[10]
        });
        markYearFor = [];
      }
    }
  }
  return {
    markYear,
    studentMarkFormated
  };
};

fetchAllMark = async () => {
  await requests.get("/StudentMark.aspx");

  return parseStudentMark();
};
fetchSemesterMark = async () => {
  await requests.get("/StudentMark.aspx");
  let form = parseInputForm();
  let options_semester = $("#drpHK option");
  let studentMark = [];
  for (let index = 0; index < options_semester.length; index++) {
    const option = options_semester[index];
    form.drpHK = $(option).val();
    await requests.post("/StudentMark.aspx", {
      form
    });
    let markSemester = parseStudentMark({
      semesterCode: form.drpHK,
      semesterName: form.drpHK
    });
    studentMark.push(markSemester);
    form = parseInputForm();
  }
  return studentMarkfetchSemesterMark;
};

start = async () => {
  await login();
  let x = await fetchAllMark();
  console.log(JSON.stringify(x));
};

start();
debugger;
