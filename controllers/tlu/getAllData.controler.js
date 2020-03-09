const {
  login,
  fetchAllMark,
  fetchInformation,
  fetchSemesterMark,
  fetchStudentTimeTable
} = require("../../modules/tlu_crawl/tlu");

const getAllData = async (req, res) => {
  try {
    // console.log(req.data)
    let { username, password } = req.data;
    await login(username, password);

    let mark = await fetchSemesterMark();
    let timetables = await fetchStudentTimeTable();
    let {studentInfo, exam} = await fetchInformation();
    
    res.json({
      information : studentInfo,
      mark,
      timetables,
      exam
    });
   
  } catch (error) {

    //destroy jwt

    //
    res.json({
      error: error.message
    });
  }
};
module.exports = getAllData;
