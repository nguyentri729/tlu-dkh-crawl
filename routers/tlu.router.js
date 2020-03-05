const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')

const getAllDataController = require("../controllers/tlu/getAllData.controler");
const AuthController = require("../controllers/tlu/Auth.controller");
const loginController = require("../controllers/tlu/Login.controller");

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get("/getAllData", AuthController, getAllDataController);
router.post("/login", loginController);

module.exports = router;
