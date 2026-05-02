const express = require("express");
const {
  createShortUrl,
  redirectToOriginal,
  getRecentLinks,
} = require("../controllers/urlController");

const router = express.Router();

router.post("/shorten", createShortUrl);
router.get("/links", getRecentLinks);
router.get("/:code", redirectToOriginal);

module.exports = router;
