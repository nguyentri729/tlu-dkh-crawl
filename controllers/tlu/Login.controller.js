const jwt = require("jsonwebtoken");
const { login, fetchInformation } = require("./../../modules/tlu_crawl/tlu");
const UserModal = require("./../../models/User.modal");

const loginController = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  try {
    await login(username, password);
    let studentInfo = await fetchInformation();
    studentInfo.username = username;
    studentInfo.password = password;

    if (studentInfo.studentCode) {
      let student = await UserModal.addUser(studentInfo);
      let { _id, studentCode, studentName } = student;
      let access_token = jwt.sign(
        {
          _id,
          studentCode,
          studentName
        },
        process.env.JWT_SECURE,
        {
          algorithm: "HS256",
          expiresIn: "7d"
        }
      );
      res.json({
        data: student,
        access_token
      });
    } else {
      res.status(302).json({
        error: "Hệ thống xảy ra lỗi"
      });
    }
  } catch (error) {
    res.stauts(302).json({
      error: error.message
    });
  }
};
module.exports = loginController;
