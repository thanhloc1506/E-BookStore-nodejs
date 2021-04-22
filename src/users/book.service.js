var mysql = require("mysql");
const config = {
  host: "localhost",
  user: "root",
  port: "3306",
  password: "LocT@2031",
  insecureAuth: true,
  database: "EBOOKSTORE",
};
const con = mysql.createConnection(config);

con.connect(function (err) {
  if (err) throw err;
});

function addBook(ISBN, tenSach, giaTien, nhaXuatBan, linhvuc, author, year) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    con.query(
      `INSERT INTO sach (ISBN, TenSach, GiaTien, TenNhaXuatBan) VALUES ('${ISBN}', '${tenSach}', ${giaTien}, '${nhaXuatBan}')`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        var authors = author.split(",");
        for (const i in authors) {
          tmp = authors[i].split("-");
          // console.log(tmp)
          addViet(tmp[0], ISBN);
        }
        addLinhVuc(ISBN, linhvuc);
        addPublishing(ISBN, nhaXuatBan, year);
      }
    );
  });
}

function addAuthor(AID, HoTen, Email, NamSinh) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    con.query(
      `INSERT INTO tacgia (AID, HoTen, Email, NamSinh) VALUES ('${AID}', '${HoTen}', '${Email}', ${NamSinh})`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      }
    );
  });
}

function addNXB(TenNhaXuatBan) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    con.query(
      `INSERT INTO nhaxuatban (TenNhaXuatBan) VALUES ('${TenNhaXuatBan}')`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      }
    );
  });
}

function addPublishing(ISBN, TenNhaXuatBan, year) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    con.query(
      `INSERT INTO namsanxuat (ISBN, TenNhaXuatBan, ANamSanXuat) VALUES ('${ISBN}', '${TenNhaXuatBan}', ${year})`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      }
    );
  });
}

function addWarehouse(makho, SID) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    con.query(
      `INSERT INTO kho (MaKho, SID) VALUES ('${makho}', '${SID}')`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      }
    );
  });
}

function addViet(AID, ISBN) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    con.query(
      `INSERT INTO viet (AID, ISBN) VALUES ('${AID}', '${ISBN}')`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      }
    );
  });
}

function addLinhVuc(ISBN, ALinhVuc) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    con.query(
      `INSERT INTO linhvuc (ISBN, ALinhVuc) VALUES ('${ISBN}', '${ALinhVuc}')`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      }
    );
  });
}

function addStaffAcc(id, fullName, email, username, hash, SID) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    // con.query(`INSERT INTO staff (id, fullName, email, username, hash, SID) VALUES ('${id}', '${fullName}', '${email}', '${username}', '${hash}', '${SID}')`, function (err, result) {
    con.query(
      ` call ChinhSuanhanvien('${id}', '${fullName}', '${email}', '${username}', '${hash}', '${SID}')`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      }
    );
  });
}

function addUserAcc(id, fullName, email, username, hash, UID) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    // con.query(`INSERT INTO user (id, fullName, email, username, hash, UID) VALUES ('${id}', '${fullName}', '${email}', '${username}', '${hash}', '${UID}')`, function (err, result) {
    con.query(
      ` call ChinhSuaKhachHang('${id}', '${fullName}', '${email}', '${username}', '${hash}', '${UID}')`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      }
    );
  });
}

function addCart(UID, ISBN, soluong, mahoadon, loai, loaisach) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    if (loai === null) {
      loai = "mua";
    }
    if (loaisach === null) {
      loaisach = "bản in";
    }
    // con.query(`INSERT INTO user (id, fullName, email, username, hash, UID) VALUES ('${id}', '${fullName}', '${email}', '${username}', '${hash}', '${UID}')`, function (err, result) {
    con.query(
      ` call ChinhSuaCart('${UID}', '${ISBN}', ${soluong}, '${mahoadon}','${loai}','${loaisach}')`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      }
    );
  });
}

function addCartCheckOut(UID, ISBN, soluong, mahoadon, loai, loaisach) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    if (loai === null) {
      loai = "mua";
    }
    if (loaisach === null) {
      loaisach = "bản in";
    }
    // con.query(`INSERT INTO user (id, fullName, email, username, hash, UID) VALUES ('${id}', '${fullName}', '${email}', '${username}', '${hash}', '${UID}')`, function (err, result) {
    con.query(
      ` call ChinhSuaCartThanhToan('${UID}', '${ISBN}', ${soluong}, '${mahoadon}','${loai}','${loaisach}')`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      }
    );
  });
}

function addTrans(UID, ISBN, NgayGio, Loai, LoaiSach, SoLuong, HoaDon) {
  const con = mysql.createConnection(config);
  console.log("ok");
  con.connect(function (err) {
    console.log("Connected!");
    let query = `INSERT INTO giaodich (UID, ISBN, NgayGio, Loai, LoaiSach, SoLuong, HoaDon ) VALUES ('${UID}', '${ISBN}', '${NgayGio}', '${Loai}', '${LoaiSach}', ${SoLuong}, '${HoaDon}' )`;
    console.log(query);
    con.query(query, function (err, result) {
      if (err) {
        console.log(err);
        throw "err";
      }
      console.log("1 record inserted");
      deleteCart(UID);
    });
  });
}

function addThanhToan(HoaDon) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    con.query(
      `INSERT INTO thanhtoan (HoaDon) VALUES ('${HoaDon}')`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      }
    );
  });
}

function addThanhToanThe(HoaDon, Code) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    con.query(
      `INSERT INTO thanhtoanthe (HoaDon) VALUES ('${HoaDon}')`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      }
    );
  });
}

function addChuyenKhoan(HoaDon) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    con.query(
      `INSERT INTO chuyenkhoan (HoaDon) VALUES ('${HoaDon}')`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      }
    );
  });
}

function addCartStaff(UID, ISBN, soluong, mahoadon, tien, loai, loaisach) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    console.log("Connected!");
    if (loai === null) {
      loai = "mua";
    }
    if (loaisach === null) {
      loaisach = "bản in";
    }
    con.query(
      `INSERT INTO cart_4staff (UID, isbn, soluong, mahoadon, tien, Loai, LoaiSach) VALUES ('${UID}', '${ISBN}', ${soluong}, '${mahoadon}', '${tien}','${loai}','${loaisach}')`,
      function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      }
    );
  });
}

function deleteCart(UID) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      `DELETE from cart_4customer where UID = '${UID}'`,
      function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
      }
    );
  });
}

function deleteCartByKey(UID, ISBN, mahoadon) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      `DELETE from cart_4customer where UID = '${UID}' and isbn = ${ISBN} and mahoadon = ${mahoadon}`,
      function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
      }
    );
  });
}

function updateCustomer(phone, address, UID) {
  const con = mysql.createConnection(config);
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      `UPDATE khachhang SET Phone = '${phone}', DiaChi = '${address}' WHERE UID = '${UID}'`,
      function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
      }
    );
  });
}

const getAllBooks = (callback) => {
  const con = mysql.createConnection(config);
  con.query("SELECT * FROM sach", function (err, result_Book, fields) {
    if (err) throw err;
    callback(null, result_Book);
  });
};

const getAllNXB = (callback) => {
  const con = mysql.createConnection(config);
  con.query("SELECT * FROM nhaxuatban", function (err, result_NSB, fields) {
    if (err) throw err;
    callback(null, result_NSB);
  });
};

const getAllAuthors = (callback) => {
  const con = mysql.createConnection(config);
  con.query("SELECT * FROM tacgia", function (err, result_Author, fields) {
    if (err) throw err;
    callback(null, result_Author);
  });
};

const getAllLinhVuc = (callback) => {
  const con = mysql.createConnection(config);
  con.query("SELECT * FROM linhvuc", function (err, result_linhvuc, fields) {
    if (err) throw err;
    callback(null, result_linhvuc);
  });
};

const getUniqueLinhVuc = (callback) => {
  const con = mysql.createConnection(config);
  con.query(
    "SELECT distinct ALinhVuc FROM linhvuc",
    function (err, result_linhvuc, fields) {
      if (err) throw err;
      callback(null, result_linhvuc);
    }
  );
};

const getAllViet = (callback) => {
  const con = mysql.createConnection(config);
  con.query("SELECT * FROM viet", function (err, result_viet, fields) {
    if (err) throw err;
    callback(null, result_viet);
  });
};

const getAllTransactions = (callback) => {
  const con = mysql.createConnection(config);
  con.query("SELECT * FROM giaodich ", function (err, result_giaodich, fields) {
    if (err) throw err;
    callback(null, result_giaodich);
  });
};
const getAllTransactions2 = (UID, callback) => {
  const con = mysql.createConnection(config);
  con.query(
    `SELECT DISTINCT ISBN FROM giaodich Where UID = '${UID}'`,
    function (err, result_giaodich, fields) {
      if (err) throw err;
      callback(null, result_giaodich);
    }
  );
};
const getAllWarehouse = (callback) => {
  const con = mysql.createConnection(config);
  con.query("SELECT * FROM kho", function (err, result_kho, fields) {
    if (err) throw err;
    callback(null, result_kho);
  });
};

const getAllstaffs = (callback) => {
  const con = mysql.createConnection(config);
  con.query("SELECT * FROM nhanvien", function (err, result_nhanvien, fields) {
    if (err) throw err;
    callback(null, result_nhanvien);
  });
};

const getAllStaffAccs = (callback) => {
  const con = mysql.createConnection(config);
  con.query("SELECT * FROM staffs", function (err, result_staffAccs, fields) {
    if (err) throw err;
    callback(null, result_staffAccs);
  });
};

const getAllUserAccs = (callback) => {
  const con = mysql.createConnection(config);
  con.query("SELECT * FROM users", function (err, result_userAccs, fields) {
    if (err) throw err;
    callback(null, result_userAccs);
  });
};

const getAllUsers = (callback) => {
  const con = mysql.createConnection(config);
  con.query(
    "SELECT * FROM khachhang",
    function (err, result_khachhang, fields) {
      if (err) throw err;
      callback(null, result_khachhang);
    }
  );
};

const getAllYear = (callback) => {
  const con = mysql.createConnection(config);
  con.query("SELECT * FROM namsanxuat", function (err, result_year, fields) {
    if (err) throw err;
    callback(null, result_year);
  });
};

const getBookByISBN = (isbn, callback) => {
  getAllBooks((error, books) => {
    for (const i in books) {
      if (books[i]["ISBN"] === isbn) {
        console.log(books[i]["ISBN"], isbn);
        callback(null, books[i]);
      }
    }
    callback(null, books[0]);
  });
};

const getLinhVucByISBN = (isbn, callback) => {
  getAllLinhVuc((error, linhvuc) => {
    for (const i in linhvuc) {
      if (linhvuc[i].ISBN === isbn) {
        callback(null, linhvuc[i]);
      }
    }
    callback(null, linhvuc[0]);
  });
};

const getAllCart = (callback) => {
  const con = mysql.createConnection(config);
  con.query(
    "SELECT * FROM cart_4customer",
    function (err, result_cart, fields) {
      if (err) throw err;
      callback(null, result_cart);
    }
  );
};

const getCartByUID = (UID, callback) => {
  getAllCart((error, carts) => {
    var _cart = [];
    for (const i in carts) {
      if (carts[i].UID === UID) {
        _cart.push(carts[i]);
      }
    }
    callback(null, _cart);
  });
};

const getNameBookByISBN = (ISBN, callback) => {
  getAllBooks((error, books) => {
    for (const i in books) {
      if (books[i]["ISBN"] === ISBN) {
        callback(null, books[i]["TenSach"]);
      }
    }
    callback(null, books[0]["TenSach"]);
  });
};

module.exports = {
  addBook,
  addAuthor,
  addNXB,
  addWarehouse,
  addViet,
  addLinhVuc,
  addStaffAcc,
  addUserAcc,
  addCart,
  addCartCheckOut,
  addThanhToan,
  addThanhToanThe,
  addChuyenKhoan,
  deleteCart,
  getAllTransactions2,
  getNameBookByISBN,
  deleteCartByKey,
  addTrans,
  addCartStaff,
  getAllBooks,
  getAllNXB,
  getAllAuthors,
  getAllLinhVuc,
  getUniqueLinhVuc,
  getAllViet,
  getAllTransactions,
  getAllWarehouse,
  getAllstaffs,
  getAllStaffAccs,
  getAllUserAccs,
  getAllUsers,
  updateCustomer,
  getAllYear,
  getBookByISBN,
  getLinhVucByISBN,
  getAllCart,
  getCartByUID,
};
