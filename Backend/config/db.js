const mongoose = require("mongoose");

//connection
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@mytube.nzxmdya.mongodb.net/?retryWrites=true&w=majority&appName=MyTube`,
      { tls: true },
    );

    console.log("Connectou ao banco!");

    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

conn();

module.exports = conn;
