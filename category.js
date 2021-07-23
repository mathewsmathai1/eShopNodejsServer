var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get("/", async (req, res) => {
  //the database connection is done before server startup and handle is stored in app.locals.db
  const db_handle = req.app.locals.db;

  db_handle.on("error", console.error.bind(console, "connection error"));
  /* Get The Total Document Count Satisfying the Query */
  let count = await db_handle
    .collection("Category_Master")
    .find({})
    .count()
    .then((val) => {
      return val;
    })
    .catch((err) => {
      console.log(err);
    });

  console.log("COUNT: ", count);

  /* Get All The Categories from Master Collection */
  db_handle
    .collection("Category_Master")
    .find({})
    .toArray(async function (err, result) {
      if (err) {
        console.log(err);
        db_handle.close();
        res.end("REQUEST FAILED");
      } else {
        result = result.map((arrElement) => {
          delete arrElement._id;
          //delete the mongo object id since it is not to be revealed to end users
          //The data send to the browser will be an array of Objects {object_name: Object_id}
          return { [arrElement.Category_name]: arrElement.Category_id };
        });
        //send when count matches to length of the documents array
        if (result.length == count) {
          console.log(result);
          res.end(JSON.stringify(result));
        }
      }
    });
});

module.exports = router;
