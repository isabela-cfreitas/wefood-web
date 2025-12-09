//dupla: isabela de castro freitas(112692) e pedro henrique coura pereira(112693)
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "wefood"
});

module.exports = pool;
