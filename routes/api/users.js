const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");

router.post(
  "/",
  [
    check("name", "Name ist required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password has to be at least 6 characters").isLength({
      min: 6
    })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("User route");
  }
);

module.exports = router;
