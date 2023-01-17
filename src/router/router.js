const express = require("express");
const router = express();

const controller = require("../controller/one2oneRelations");

router.post("/save", controller.add);
router.post("/get", controller.getOnrOrManyRecords);
router.put("/update", controller.updateOneOrMoreRecords);
router.delete("/delete", controller.deleteOneOrMore);

module.exports = router;
