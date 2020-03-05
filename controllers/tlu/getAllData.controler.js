const {login, fetchAllMark, fetchInformation, fetchSemesterMark, fetchStudentTimeTable} = require('../../modules/tlu_crawl/tlu')
const getAllData = async (req, res) => {
   // console.log(req.data)
   let {username, password} = req.data 
   await login(username, password)
   
   let mark = await fetchAllMark()
   let timetables = await fetchStudentTimeTable()
   let information = await fetchInformation()
   res.json({
       information,
       mark,
       timetables
   })
    
}
module.exports = getAllData