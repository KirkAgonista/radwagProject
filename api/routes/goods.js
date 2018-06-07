const express = require("express"),
      router = express.Router(),
      helpers = require("../helpers/goods");

router.route("/")
    .get(helpers.getGoods)
    .post(helpers.createGood);

router.route("/:goodId")
    .get(helpers.getGood)
    .put(helpers.updateGood)
    .delete(helpers.deleteGood);

module.exports = router;
