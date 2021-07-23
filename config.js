const mongoose = require("mongoose");
const uri = process.env.DATABASE_URI;
async function connectToDB() {
  return mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected Successfully");
    }
  );
}

module.exports = { connectToDB: connectToDB };
