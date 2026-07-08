const express = require("express");

const upload = require("../middleware/upload");

const {
  importCSV,
} = require("../controllers/importController");

const router = express.Router();

router.post("/", upload.single("file"), importCSV);

module.exports = router;