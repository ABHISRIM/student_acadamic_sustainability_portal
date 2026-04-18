const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  console.log(req.body);
  res.json({ message: "Issue received successfully" });
});

module.exports = router;
