const fs = require("fs");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const path = require("path");
const cookieParser = require("cookie-parser");
const validateRequest = require("../middleware/validate-request");
const { authorize, verifiedToken } = require("../middleware/authorize");
const userService = require("./user.service");
const userQuery = require("./user_query");
const {
  getAllBooks,
  getAllNXB,
  getAllAuthors,
  getAllUserAccs,
  updateCustomer,
  addUserAcc,
  getUniqueLinhVuc,
  getAllTransactions,
  getBookByISBN,
  getAllLinhVuc,
  getLinhVucByISBN,
  addBook,
  addCart,
  getCartByUID,
  deleteCart,
  addTrans,
  getAllCart,
  getAllUsers,
  deleteCartByKey,
  addCartCheckOut,
  addThanhToanThe,
  addChuyenKhoan,
  addStaffAcc,
  addCartStaff,
  getAllTransactions2,
  addThanhToan,
} = require("./book.service");
const LocalStorage = require("node-localstorage").LocalStorage;
const { isBoolean } = require("util");
const {
  getNewUID,
  getCustomerByUID,
  mergeUser,
  mergeTrans,
  getTransactionByUID,
  getHoaDon,
  mergeCart,
  calBill,
  getTransactionByUID2,
} = require("./user.service");
// const { Transaction } = require('sequelize/types');
localStorage = new LocalStorage("./scratch");
// routes
router.get("/register", (req, res) => {
  res.render("register", {
    layout: "register_layout.handlebars",
    position: "Customer",
    url: "users",
  });
});
router.get("/error", (req, res) => {
  res.render("error", { layout: "error_layout.handlebars" });
});
router.get("/homepage", verifiedToken, (req, res) => {
  getAllBooks((error, books) => {
    getAllNXB((error, NXB) => {
      getAllAuthors((error, authors) => {
        getUniqueLinhVuc((error, Ulinhvuc) => {
          // console.log(Ulinhvuc)
          res.render("homeUser", {
            layout: "homeUser_layout.handlebars",
            books,
            url: "users",
            fullName: localStorage.getItem("fullName"),
            email: localStorage.getItem("email"),
            id: localStorage.getItem("id"),
            uid: localStorage.getItem("uid"),
            NXB,
            tacgia: authors,
            Ulinhvuc,
          });
        });
      });
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    layout: "login_layout.handlebars",
    position: "Customer",
    url: "users",
  });
});

router.get("/book_detail/:isbn", verifiedToken, (req, res) => {
  const isbn = req.params.isbn;
  // console.log(isbn)
  getAllNXB((error, NXB) => {
    getAllAuthors((error, authors) => {
      getUniqueLinhVuc((error, Ulinhvuc) => {
        getBookByISBN(isbn, (error, book) => {
          getLinhVucByISBN(isbn, (error, linhvuc) => {
            // console.log(linhvuc)
            res.render("book_detail", {
              layout: "book_detail_layout.handlebars",
              book,
              linhvuc,
              NXB,
              tacgia: authors,
              Ulinhvuc,
            });
          });
        });
      });
    });
  });
});

router.get("/profile", verifiedToken, (req, res) => {
  var _user = {};
  getCustomerByUID(localStorage.getItem("uid"), (error, user) => {
    mergeUser(user, (error, mergedUser) => {
      _user = mergedUser;
    });
  });
  getAllNXB((error, NXB) => {
    getAllAuthors((error, authors) => {
      getAllTransactions2(localStorage.getItem("uid"), (error, transaction) => {
        getAllBooks((error, books) => {
          mergeTrans(transaction, books, (error, transactions) => {
            res.render("profile", {
              layout: "profile_layout.handlebars",
              fullName: localStorage.getItem("fullName"),
              email: localStorage.getItem("email"),
              id: localStorage.getItem("id"),
              uid: localStorage.getItem("uid"),
              NXB,
              tacgia: authors,
              phone: _user["Phone"],
              address: _user["DiaChi"],
              transaction: transactions,
            });
          });
        });
      });
    });
  });
});

router.get("/tacgia-theloai", verifiedToken, (req, res) => {
  var linhvuc = req.query.linhvuc;
  getAllBooks((error, books) => {
    getAllNXB((error, NXB) => {
      getAllAuthors((error, authors) => {
        getUniqueLinhVuc((error, Ulinhvuc) => {
          userQuery.getAuthorByLinhVuc(linhvuc, (error, authorsByLinhVuc) => {
            res.render("author-linhvuc", {
              layout: "profile_layout.handlebars",
              books,
              url: "users",
              fullName: localStorage.getItem("fullName"),
              email: localStorage.getItem("email"),
              id: localStorage.getItem("id"),
              uid: localStorage.getItem("uid"),
              NXB,
              tacgia: authors,
              Ulinhvuc,
              authorByLinhVuc: authorsByLinhVuc[0],
            });
          });
        });
      });
    });
  });
});

router.get("/history", verifiedToken, (req, res) => {
  var date = req.query.date;
  if (date) res.redirect(`/users/books/bookByDate/${date}`);
  getAllNXB((error, NXB) => {
    getAllAuthors((error, authors) => {
      getUniqueLinhVuc((error, Ulinhvuc) => {
        res.render("history", {
          layout: "profile_layout.handlebars",
          NXB,
          tacgia: authors,
          Ulinhvuc,
        });
      });
    });
  });
});

router.post("/searchText", verifiedToken, (req, res) => {
  const searchText = req.body;
  res.redirect(`/users/books/searchText/${searchText.fieldBook}`);
});

router.post("/publishing", verifiedToken, (req, res) => {
  const publishing = req.body;
  res.redirect(`/users/books/publishing/${publishing.year}`);
});

router.get("/books/:require/:searchText", verifiedToken, (req, res) => {
  const require = req.params.require;
  const searchText = req.params.searchText;
  getAllNXB((error, NXB) => {
    getAllAuthors((error, authors) => {
      getUniqueLinhVuc((error, Ulinhvuc) => {
        if (require == "tacgia") {
          userQuery.getBooksByAuthor(searchText, (error, bookByAuthor) => {
            // console.log(bookByAuthor)
            res.render("books", {
              layout: "books_layout.handlebars",
              NXB,
              tacgia: authors,
              books: bookByAuthor[0],
              searchText,
              Ulinhvuc,
            });
          });
        } else if (require == "linhvuc") {
          userQuery.getBooksByLinhVuc(searchText, (error, bookByLinhVuc) => {
            res.render("books", {
              layout: "books_layout.handlebars",
              NXB,
              tacgia: authors,
              books: bookByLinhVuc[0],
              searchText,
              Ulinhvuc,
            });
          });
        } else if (require == "searchText") {
          userQuery.getBooksByFeild(searchText, (error, bookByFeild) => {
            res.render("books", {
              layout: "books_layout.handlebars",
              NXB,
              tacgia: authors,
              books: bookByFeild[0],
              searchText,
              Ulinhvuc,
            });
          });
        } else if (require == "publishing") {
          userQuery.getBookByYear(searchText, (error, bookByYear) => {
            res.render("books", {
              layout: "books_layout.handlebars",
              NXB,
              tacgia: authors,
              books: bookByYear[0],
              searchText,
              Ulinhvuc,
            });
          });
        } else if (require == "bookByDate") {
          // console.log(searchText)
          userQuery.getBookByDate(searchText, (error, bookByDate) => {
            res.render("books", {
              layout: "books_layout.handlebars",
              NXB,
              tacgia: authors,
              books: bookByDate[0],
              searchText,
              Ulinhvuc,
            });
          });
        } else if (require == "bookByMonth") {
          const query = req.query.month;
          var month, year;
          var tmp = query.split("/");
          month = tmp[0];
          year = tmp[1];
          userQuery.getBooksByMonth(
            localStorage.getItem("uid"),
            month,
            year,
            (error, bookByDate) => {
              // console.log(bookByDate)
              userService.getPrice(bookByDate[0], (error, books) => {
                res.render("books", {
                  layout: "books_layout.handlebars",
                  NXB,
                  tacgia: authors,
                  Ulinhvuc,
                  month,
                  year,
                  books: books,
                  searchText,
                });
              });
            }
          );
        }
      });
    });
  });
});

// router.post('/books/:require', (req, res) => {
//     const searchText = req.body
//     console.log(searchText)
//     getAllNXB((error, NXB) => {
//         getAllAuthors((error, authors) => {
//             getUniqueLinhVuc((error, Ulinhvuc) => {
//                 res.render('books', { layout: 'books_layout.handlebars', searchText, NXB, tacgia: authors, Ulinhvuc })
//             })
//         })
//     })
// })

router.get("/transactions/:id", verifiedToken, (req, res) => {
  var id = req.params.id;
  getAllNXB((error, NXB) => {
    getAllAuthors((error, authors) => {
      getUniqueLinhVuc((error, Ulinhvuc) => {
        if (id == 1) {
        } else if (id == 2) {
          const query = req.query.month;
          var month, year;
          if (query) {
            var tmp = query.split("/");
            console.log(tmp);
            month = tmp[0];
            year = tmp[1];
            userQuery.getTransInMonth(
              localStorage.getItem("uid"),
              1,
              month,
              year,
              (error, transactions) => {
                res.render("view-trans", {
                  layout: "books_layout.handlebars",
                  NXB,
                  tacgia: authors,
                  Ulinhvuc,
                  month,
                  year,
                  transactions: transactions[0],
                });
              }
            );
          } else {
            res.render("view-trans", {
              layout: "books_layout.handlebars",
              NXB,
              tacgia: authors,
              Ulinhvuc,
            });
          }
        } else if (id == 3) {
        } else if (id == 4) {
          const query = req.query.month;
          const linhvuc_query = req.query.linhvuc;
          var month, year, linhvuc;
          if (query && linhvuc_query) {
            var tmp = query.split("/");
            month = tmp[0];
            year = tmp[1];
            linhvuc = linhvuc_query;
            userQuery.getTongSachTheoTheLoai(
              localStorage.getItem("uid"),
              linhvuc,
              month,
              year,
              (error, count) => {
                res.render("view-trans", {
                  layout: "books_layout.handlebars",
                  NXB,
                  tacgia: authors,
                  Ulinhvuc,
                  month,
                  year,
                  count: count[0][0].tongso,
                  linhvuc,
                  type: 4,
                });
              }
            );
          } else {
            res.render("view-trans", {
              layout: "books_layout.handlebars",
              NXB,
              tacgia: authors,
              Ulinhvuc,
              type: 4,
            });
          }
        } else if (id == 5) {
          const query = req.query.month;
          var month, year;
          if (query) {
            var tmp = query.split("/");
            month = tmp[0];
            year = tmp[1];
            userQuery.getMostTransInMonth(
              localStorage.getItem("uid"),
              month,
              year,
              (error, transactions) => {
                res.render("view-trans", {
                  layout: "books_layout.handlebars",
                  NXB,
                  tacgia: authors,
                  Ulinhvuc,
                  month,
                  year,
                  transactions: transactions[0],
                });
              }
            );
          } else {
            res.render("view-trans", {
              layout: "books_layout.handlebars",
              NXB,
              tacgia: authors,
              Ulinhvuc,
            });
          }
        } else if (id == 6) {
          const query = req.query.month;
          var month, year;
          if (query) {
            var tmp = query.split("/");
            month = tmp[0];
            year = tmp[1];
            userQuery.getTransFor2CateBook(
              localStorage.getItem("uid"),
              month,
              year,
              (error, transactions) => {
                res.render("view-trans", {
                  layout: "books_layout.handlebars",
                  NXB,
                  tacgia: authors,
                  Ulinhvuc,
                  month,
                  year,
                  transactions: transactions[0],
                });
              }
            );
          } else {
            res.render("view-trans", {
              layout: "books_layout.handlebars",
              NXB,
              tacgia: authors,
              Ulinhvuc,
            });
          }
        } else {
          res.render("view-trans", {
            layout: "books_layout.handlebars",
            NXB,
            tacgia: authors,
            Ulinhvuc,
            type: 4,
          });
        }
      });
    });
  });
});

router.get("/cart", verifiedToken, (req, res) => {
  getCartByUID(localStorage.getItem("uid"), (error, carts) => {
    mergeCart(carts, (error, _carts) => {
      for (const i in _carts) {
        if (_carts[i]["Loai"] == "mua" && _carts[i]["LoaiSach"] == "bản in") {
          _carts[i]["GiaTien"] = _carts[i]["GiaTien"];
          _carts[i]["tong"] = _carts[i]["GiaTien"] * _carts[i]["soluong"];
        } else if (
          _carts[i]["Loai"] == "mua" &&
          _carts[i]["LoaiSach"] == "bản điện tử"
        ) {
          _carts[i]["GiaTien"] = _carts[i]["GiaTien"] * 0.5;
          _carts[i]["tong"] = _carts[i]["GiaTien"] * _carts[i]["soluong"];
        } else if (
          _carts[i]["Loai"] == "thuê" &&
          _carts[i]["LoaiSach"] == "bản điện tử"
        ) {
          _carts[i]["GiaTien"] = _carts[i]["GiaTien"] * 0.2;
          _carts[i]["tong"] = _carts[i]["GiaTien"] * _carts[i]["soluong"];
        }
      }

      calBill(_carts, (error, price) => {
        var price2 = price * 0.09;
        var price3 = price + price2 + 5000;
        res.render("cart", {
          layout: "cart_layout.handlebars",
          carts: _carts,
          price,
          price2,
          price3,
        });
      });
    });
  });
});

router.post("/cart", verifiedToken, (req, res) => {
  if (req.body["type"] == "capnhat") {
    var data = JSON.parse(req.body["data"]);
    console.log(data);
    for (const i in data) {
      if (data[i][5] == true) {
        deleteCartByKey(localStorage.getItem("uid"), data[i][0], data[i][1]);
      } else {
        let loai = "";
        let loaisach = "";
        b = data[i][4].split(" - ");
        if (b[0] == "Mua") {
          loai = "mua";
        } else {
          loai = "thuê";
        }
        if (b[1] == "Bản Điện Tử") {
          loaisach = "bản điện tử";
        } else {
          loaisach = "bản in";
        }
        console.log(loai, loaisach);
        addCartCheckOut(
          localStorage.getItem("uid"),
          data[i][0],
          data[i][3],
          localStorage.getItem("hoadon"),
          loai,
          loaisach
        );
      }
    }
  } else if (req.body["type"] == "thanhtoan") {
    var data = JSON.parse(req.body["data"]);
    console.log(data);
    for (const i in data) {
      let loai = "";
      let loaisach = "";
      b = data[i][4].split(" - ");
      if (b[0] == "Mua") {
        loai = "mua";
      } else {
        loai = "thuê";
      }
      if (b[1] == "Bản Điện Tử") {
        loaisach = "bản điện tử";
      } else {
        loaisach = "bản in";
      }
      addCartCheckOut(
        localStorage.getItem("uid"),
        data[i][0],
        data[i][3],
        localStorage.getItem("hoadon"),
        loai,
        loaisach
      );
    }

    res.redirect("/users/checkout");
  }
});
router.get("/tmp", verifiedToken, (req, res) => {
  res.redirect("/users/cart");
});

router.get("/cart/:isbn", verifiedToken, (req, res) => {
  var isbn = req.params.isbn;
  var count = req.params.count;
  addCart(
    localStorage.getItem("uid"),
    isbn,
    1,
    localStorage.getItem("hoadon"),
    null,
    null
  );
  res.redirect("/users/cart");
});

router.get("/logout", (req, res) => {
  localStorage.removeItem("token");
  localStorage.removeItem("fullName");
  localStorage.removeItem("email");
  localStorage.removeItem("id");
  localStorage.removeItem("uid");
  return res.redirect("/users/login");
});

router.post("/checkout", verifiedToken, (req, res) => {
  console.log(JSON.parse(req.body["data"]));
  info = JSON.parse(req.body["data"]);
  const phone = info["phone"];
  const diachi = info["diachi"];
  const method = info["phuongthucthanhtoan"];
  const data = info["thongtin"];
  var currentdate = new Date().toISOString().slice(0, 19).replace("T", " ");
  for (const i in data) {
    console.log("ok");
    let loai = "";
    let loaisach = "";
    b = data[i][4].split(" - ");
    if (b[0] == "Mua") {
      loai = "mua";
    } else {
      loai = "thuê";
    }
    if (b[1] == "Bản Điện Tử") {
      loaisach = "bản điện tử";
    } else {
      loaisach = "bản in";
    }
    addThanhToan(localStorage.getItem("hoadon"));
    addTrans(
      localStorage.getItem("uid"),
      data[i][0],
      currentdate,
      data[i][4],
      data[i][5],
      data[i][1],
      localStorage.getItem("hoadon")
    );
    addCartStaff(
      localStorage.getItem("uid"),
      data[i][0],
      data[i][1],
      localStorage.getItem("hoadon"),
      data[i][3],
      loai,
      loaisach
    );
  }
  if (method == "thanhtoanthe") {
    addThanhToanThe(
      localStorage.getItem("hoadon"),
      localStorage.getItem("hoadon")
    );
  } else if (method == "chuyenkhoan") {
    addChuyenKhoan(localStorage.getItem("hoadon"));
  }
  getHoaDon((error, hoadon) => {
    localStorage.removeItem("hoadon");
    localStorage.setItem("hoadon", hoadon);
  });
  res.send("ok");
});

router.get("/checkout", verifiedToken, (req, res) => {
  getAllNXB((error, NXB) => {
    getAllAuthors((error, authors) => {
      getUniqueLinhVuc((error, Ulinhvuc) => {
        getAllCart((error, carts) => {
          mergeCart(carts, (error, _carts) => {
            let tong = 0;
            for (const i in _carts) {
              if (
                _carts[i]["Loai"] == "mua" &&
                _carts[i]["LoaiSach"] == "bản in"
              ) {
                _carts[i]["GiaTien"] = _carts[i]["GiaTien"];
                _carts[i]["tong"] = _carts[i]["GiaTien"] * _carts[i]["soluong"];
              } else if (
                _carts[i]["Loai"] == "mua" &&
                _carts[i]["LoaiSach"] == "bản điện tử"
              ) {
                _carts[i]["GiaTien"] = _carts[i]["GiaTien"] * 0.5;
                _carts[i]["tong"] = _carts[i]["GiaTien"] * _carts[i]["soluong"];
              } else if (
                _carts[i]["Loai"] == "thuê" &&
                _carts[i]["LoaiSach"] == "bản điện tử"
              ) {
                _carts[i]["GiaTien"] = _carts[i]["GiaTien"] * 0.2;
                _carts[i]["tong"] = _carts[i]["GiaTien"] * _carts[i]["soluong"];
              }
              tong += _carts[i]["tong"];
            }
            var khachhang = null;
            getAllUsers((error, customers) => {
              for (const i in customers) {
                if (customers[i]["UID"] == localStorage.getItem("uid")) {
                  khachhang = customers[i];
                  break;
                }
              }
              res.render("checkout", {
                layout: "checkout_layout.handlebars",
                url: "users",
                fullName: localStorage.getItem("fullName"),
                email: localStorage.getItem("email"),
                id: localStorage.getItem("id"),
                uid: localStorage.getItem("uid"),
                NXB,
                tacgia: authors,
                Ulinhvuc,
                carts: _carts,
                tong,
                Phone: khachhang["Phone"],
                Address: khachhang["DiaChi"],
              });
            });
          });
        });
      });
    });
  });
});

router.post("/login", authenticateSchema, authenticate);
router.post("/register", registerSchema, register);
router.get("/", verifiedToken, getAll);
router.post("/profile", verifiedToken, updateSchema, update);

module.exports = router;

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((user) => {
      localStorage.setItem("token", user.token);
      localStorage.setItem("fullName", user.fullName);
      localStorage.setItem("email", user.email);
      localStorage.setItem("id", user.id);
      localStorage.setItem("uid", user.uid);
    })
    .then(res.redirect("/users/homepage"))
    .catch(next);
}

function registerSchema(req, res, next) {
  const schema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    repeatPassword: Joi.any().valid(Joi.ref("password")).required(),
  });
  validateRequest(req, next, schema);
}

function register(req, res, next) {
  getNewUID((error, id) => {
    var _uid = "U" + id.toString();
    req.body["uid"] = _uid;
    // console.log(req.body)
    addUserAcc(
      id,
      req.body["fullName"],
      req.body["email"],
      req.body["username"],
      null,
      _uid
    );
  });
  userService
    .create(req.body)
    .then(res.redirect("/users/login"))
    .catch(res.send("Không thể tạo tài khoản !"));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.user);
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    fullName: Joi.string().empty(""),
    email: Joi.string().empty(""),
    phone: Joi.string(),
    address: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  const infoUser = req.body;
  // console.log(infoUser)
  var customer = {
    phone: infoUser["phone"],
    address: infoUser["address"],
  };
  var user = {
    fullName: infoUser["fullName"],
    email: infoUser["email"],
  };
  localStorage.setItem("fullName", infoUser["fullName"]);
  userService
    .update(localStorage.getItem("id"), user)
    .then(
      updateCustomer(
        customer["phone"],
        customer["address"],
        localStorage.getItem("uid")
      )
    )
    .then(res.redirect("/users/profile"))
    .catch(next);
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch(next);
}

const writeContent = (outputDir, filename, content) => {
  const filePath = outputDir + "/" + filename;
  fs.access(outputDir, function (error) {
    if (error) {
      fs.mkdirSync(outputDir);
      fs.writeFileSync(filePath, content);
    } else {
      fs.writeFileSync(filePath, content);
    }
  });
};
