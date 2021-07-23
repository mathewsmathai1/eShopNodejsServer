var express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
var router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get("/", async (req, res) => {
  let category_id = req.query.category_id;
  let pagesize = parseInt(req.query.pagesize);
  let page = parseInt(req.query.page);

  const db_handle = req.app.locals.db;

  db_handle.on("error", console.error.bind(console, "connection error"));

  let count = await db_handle
    .collection("Product_Details")
    .find({ Category_id: category_id })
    .count()
    .then((val) => {
      return val;
    })
    .catch((err) => {
      console.log(err);
    });

  /* skip the already shown records and paginate based on the query params received */
  db_handle
    .collection("Product_Details")
    .find({ Category_id: category_id })
    .skip(pagesize * (page - 1))
    .limit(pagesize)
    .toArray(async function (err, result) {
      if (err) {
        console.log(err);
        res.end(err);
      } else {
        result = result.map((arrElement) => {
          console.log(arrElement._id);
          delete arrElement._id;
          return arrElement;
        });

        console.log(result);
        result[result.length] = count;
        //total count is set to the last position of the array for the client to decide the number of pages required
        res.send(JSON.stringify(result));
      }
    });
});

module.exports = router;
