var express = require("express");
var router = express.Router();
var path = require("path");
let fs = require("fs");
let {
  uploadAFileWithField,
  uploadMultiFilesWithField,
} = require("../utils/uploadHandler");
const { Response } = require("../utils/responseHandler");

router.get("/:filename", function (req, res, next) {
  // check in images first then files
  let imagePath = path.join(
    __dirname,
    "../resources/images/",
    req.params.filename
  );
  let filesPath = path.join(
    __dirname,
    "../resources/files/",
    req.params.filename
  );
  if (fs.existsSync(imagePath)) {
    res.status(200).sendFile(imagePath);
  } else if (fs.existsSync(filesPath)) {
    res.status(200).sendFile(filesPath);
  } else {
    Response(res, 404, false, "File not found");
  }
});

router.post(
  "/uploads",
  uploadAFileWithField("image"),
  function (req, res, next) {
    // If image was saved under resources/images, return /images path
    let urlPath = `/images/${req.file.filename}`;
    Response(res, 200, true, urlPath);
  }
);
router.post(
  "/uploadMulti",
  uploadMultiFilesWithField("image"),
  function (req, res, next) {
    let URLs = req.files.map(function (file) {
      return `/images/${file.filename}`;
    });
    Response(res, 200, true, URLs);
  }
);

module.exports = router;
