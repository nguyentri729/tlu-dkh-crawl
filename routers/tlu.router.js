const express = require("express");
const router = express.Router();
const getAllDataController = require("../controllers/tlu/getAllData.controler");
const { login, fetchInformation } = require("../modules/tlu_crawl/tlu");
const UserModal = require('../models/User.modal')
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});
router.get("/getAllData", getAllDataController);
router.get("/login/:username/:password", async (req, res) => {
  let username = req.params.username;
  let password = req.params.password;
  
  console.log(UserModal.addUser())
  res.send('ok')
  return
  try {
    await login();
    let studentInfo = await fetchInformation()
    res.json(studentInfo)
  } catch (error) {
    res.json({
      error: error.message
    });
  }
});
module.exports = router;
