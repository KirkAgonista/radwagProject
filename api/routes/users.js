const express = require("express"),
      router = express.Router(),
      helpers = require("../helpers/users");

router.route("/signup")
  .post(helpers.registerUser);

router.route("/login")
  .post(helpers.loginUser);

router.route("/")
  .get(helpers.getUsers);

router.route("/:userId")
  .get(helpers.getUser)
  .put(helpers.updateUser)
  .delete(helpers.deleteUser);

module.exports = router;
