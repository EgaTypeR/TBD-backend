const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Tbd0000",
  host:"172.173.214.81",
  port: 5432,
  database:"project-TBD"
});

module.exports = pool;