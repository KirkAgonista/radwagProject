const express = require("express");
const router = express.Router();
const helpers = require("../helpers/contractors");

router.route("/")
  .get(helpers.getContractors)
  .post(helpers.createContractor);

router.route("/:contractorId")
  .get(helpers.getContractor)
  .put(helpers.updateContractor)
  .delete(helpers.deleteContractor);

module.exports = router;
