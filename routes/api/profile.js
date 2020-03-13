const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });

    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There ist no profile for this user" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (location) profileFields.location = location;
    if (website) profileFields.website = website;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.scoial.youtube = youtube;
    if (twitter) profileFields.scoial.twitter = twitter;
    if (youtube) profileFields.scoial.youtube = youtube;
    if (instagram) profileFields.scoial.instagram = instagram;
    if (linkedin) profileFields.scoial.linkedin = linkedin;
    if (facebook) profileFields.scoial.facebook = facebook;

    try {
      let profile = Profile.findOne({user: req.user.id});
      if(profile){
        profile = await Profile.findByIdAndUpdate(
          {user: req.user.id},
          {$set: profileFields},
          {new: true}
        );
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
   
  }
);

module.exports = router;
