const Pool = require("pg").Pool;
require("dotenv").config()


// const pool = new Pool({
//   user: process.env.USER,
//   password: "Tbd0000",
//   host:"172.173.214.81",
//   port: 5432,
//   database:"project-TBD"
// });

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host:process.env.IP_DATABASE,
  port: process.env.PORT,
  database:process.env.DATABASE
});

module.exports = pool;