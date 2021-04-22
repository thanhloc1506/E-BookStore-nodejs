var mysql = require("mysql");
const config = {
  host: "localhost",
  user: "customer",
  port: "3306",
  password: "LocT@2031",
  insecureAuth: true,
  database: "EBOOKSTORE",
};
const con = mysql.createConnection(config);

const getBooksByAuthor = (author, callback) => {
  const con = mysql.createConnection(config);
  con.query(
    `call XemSachTheoTacGia('${author}')`,
    function (err, result_BookByAuthor, fields) {
      if (err) throw err;
      callback(null, result_BookByAuthor);
    }
  );
};

const getBooksByLinhVuc = (linhvuc, callback) => {
  const con = mysql.createConnection(config);
  con.query(
    `call XemSachTheoTheLoai('${linhvuc}')`,
    function (err, result_BookByLinhVuc, fields) {
      if (err) throw err;
      callback(null, result_BookByLinhVuc);
    }
  );
};

const getBooksByFeild = (searchText, callback) => {
  const con = mysql.createConnection(config);
  con.query(
    `call TimSachTheoTen('${searchText}')`,
    function (err, result_BookByTuKhoa, fields) {
      if (err) throw err;
      callback(null, result_BookByTuKhoa);
    }
  );
};

const getBookByYear = (year, callback) => {
  const con = mysql.createConnection(config);
  con.query(
    `call XemSachTheoNamXB('${year}')`,
    function (err, result_BookByYear, fields) {
      if (err) throw err;
      callback(null, result_BookByYear);
    }
  );
};

const getAuthorByLinhVuc = (linhvuc, callback) => {
  const con = mysql.createConnection(config);
  con.query(
    `call XemTacGiaTheoTheLoai('${linhvuc}')`,
    function (err, result_Author, fields) {
      if (err) throw err;
      callback(null, result_Author);
    }
  );
};

const getBookByDate = (uid, day, month, year, callback) => {
  const con = mysql.createConnection(config);
  con.query(
    `call XemSachTrong1Ngay('${uid}', ${day}, ${month}, ${year})`,
    function (err, result_book, fields) {
      if (err) throw err;
      callback(null, result_book);
    }
  );
};

const getTransInMonth = (uid, op, month, year, callback) => {
  const con = mysql.createConnection(config);
  con.query(
    `call XemGiaoDichTrong1Thang('${uid}', 1, ${month}, ${year})`,
    function (err, result_trans, fields) {
      if (err) throw err;
      callback(null, result_trans);
    }
  );
};

const getBooksByMonth = (uid, month, year, callback) => {
  const con = mysql.createConnection(config);
  con.query(
    `call XemSachTrong1Thang('${uid}', ${month}, ${year})`,
    function (err, result_books, fields) {
      if (err) throw err;
      callback(null, result_books);
    }
  );
};

const getMostTransInMonth = (uid, month, year, callback) => {
  const con = mysql.createConnection(config);
  con.query(
    `call XemGDMuaNhieuNhatTrong1Thang('${uid}', ${month}, ${year})`,
    function (err, result_trans, fields) {
      if (err) throw err;
      callback(null, result_trans);
    }
  );
};

const getTransFor2CateBook = (uid, month, year, callback) => {
  const con = mysql.createConnection(config);
  con.query(
    `call XemGD2LoaiTrong1Thang('${uid}', ${month}, ${year})`,
    function (err, result_trans, fields) {
      if (err) throw err;
      callback(null, result_trans);
    }
  );
};

const getTongSachTheoTheLoai = (uid, linhvuc, month, year, callback) => {
  const con = mysql.createConnection(config);
  con.query(
    `call XemTongSoSachTheoTheLoai('${uid}', '${linhvuc}', ${month}, ${year})`,
    function (err, result_count, fields) {
      if (err) throw err;
      callback(null, result_count);
    }
  );
};

module.exports = {
  getBooksByAuthor,
  getBooksByLinhVuc,
  getBooksByFeild,
  getBookByYear,
  getAuthorByLinhVuc,
  getBookByDate,
  getTransInMonth,
  getBooksByMonth,
  getMostTransInMonth,
  getTransFor2CateBook,
  getTongSachTheoTheLoai,
};
