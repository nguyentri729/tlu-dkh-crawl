const getAllData = async (req, res) => {
  try {
    // console.log(req.data)
    let { username, password } = req.data;
    if (parseInt(username.slice(0, 2)) >= 19) {
      const {
        login,
        getMark,
        fetchInformation,
        fetchStudentTimeTable
      } = require("../../modules/tlu_crawl/tluNew");

      await login(username, password);

      
      let { studentInfo } = await fetchInformation();
      let mark = await getMark();
      let timetables = await fetchStudentTimeTable();
      res.json({
        information: studentInfo,
        mark: {
          studentMark: mark
        },
        timetables
      });
    } else {
      const {
        login,
        fetchAllMark,
        fetchInformation,
        fetchSemesterMark,
        fetchStudentTimeTable
      } = require("../../modules/tlu_crawl/tlu");

      await login(username, password);

      let mark = await fetchSemesterMark();
      let timetables = await fetchStudentTimeTable();
      let { studentInfo, exam } = await fetchInformation();

      res.json({
        information: studentInfo,
        mark,
        timetables,
        exam
      });
    }
  } catch (error) {
    //destroy jwt

    //
    res.json({
      error: error.message
    });
  }
};
module.exports = getAllData;
