var mysql = require("mysql");
const config = {
  host: "localhost",
  user: "staff",
  port: "3306",
  password: "LocT@2031",
  insecureAuth: true,
  database: "EBOOKSTORE",
};
const con = mysql.createConnection(config);

const getAuthorByMostBookOfDate = (date, op, callback) => {
  const con = mysql.createConnection(config);
  con.query(
    `call XemTacGiaCoSachBanChayNhat('${date}', ${op})`,
    function (err, result_Author, fields) {
      if (err) throw err;
      callback(null, result_Author);
    }
  );
};

const getEBookByDate = (day, month, year, op, callback) => {
  const con = mysql.createConnection(config);
  con.query(
    `call XemSachMuaTrongMotNgay('${day}', '${month}', '${year}', ${op})`,
    function (err, result_Trans, fields) {
      if (err) throw err;
      callback(null, result_Trans);
    }
  );
};

// const sachduocmuatrongngay = ()

module.exports = {
  getAuthorByMostBookOfDate,
  getEBookByDate,
};
