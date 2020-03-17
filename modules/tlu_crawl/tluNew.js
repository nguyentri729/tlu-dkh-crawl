require("dotenv").config({ path: "../../.env" });
const request = require("request-promise");
const {parseTimeTableNew, sortByDay} = require('./parseFunc')
var access_token;
var uid;
var $;
const SERVER = "http://sv20.tlu.edu.vn:8092";
const requests = function() {
  return request.defaults({
    transform: body => {
      $ = body;
      // console.log(body)
      return $;
    },
    headers:
      access_token != ""
        ? {
            Authorization: "Bearer " + access_token
          }
        : {},
    baseUrl: SERVER,
    json: true
  });
};
const login = async function(username, password) {
  var form = {
    client_id: "education_client",
    grant_type: "password",
    username: process.env.DKH_USERNAME,
    password: process.env.DKH_PASSWORD,
    client_secret: "password"
  };
  let token = await requests().post("/education/oauth/token", { form });
  access_token = token.access_token ? token.access_token : "";

  //get userInfo
  let userInfo = await requests().get("/education/api/users/getCurrentUser");
  
  let { displayName, id } = userInfo.person;
  uid = id; //set uid data
  //get nganhhoc
  let { studentCode, enrollmentClass } = await requests().get(
    "/education/api/student/" + id
  );
  return {
    studentCode,
    studentName: displayName,
    studentClass: enrollmentClass.className,
    studentMajors: enrollmentClass.department.name,
    yearLearn: enrollmentClass.schoolYear,
    dkhID: id
  };
};


const timeTableFetch = async function() {
    let {schoolYear, id} = await requests().get("/education/api/semester/semester_info");
    let timeTableNonFomart = await requests().get("/education/api/StudentCourseSubject/student/0/" + id);
    let timetableData = parseTimeTableNew(schoolYear.startDate, timeTableNonFomart)
    console.log(JSON.stringify(sortByDay(timetableData, options = { limit: 2, start: 0 })))
}
const getMark = async function() {
    return await requests().get('/education/api/studentsubjectmark/getListMarkDetailStudent/' +uid)
}
const start = async function() {
 let x = await login();
  let y = await getMark()
  console.log(y);
};

start()