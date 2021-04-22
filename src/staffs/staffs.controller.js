const express = require("express");
const router = express.Router();
const Joi = require("joi");
const upload = require("../middleware/uploadMiddleware");
const Resize = require("./Resize");
const path = require("path");
const validateRequest = require("../middleware/validate-request");
const { authorize, verifiedToken } = require("../middleware/authorize");
const fs = require("fs");
const staffService = require("./staff.service");
const {
  getAllBooks,
  getAllLinhVuc,
  getAllAuthors,
  getAllViet,
  getAllNXB,
  getAllTransactions,
  getAllWarehouse,
  addBook,
  addAuthor,
  addNXB,
  addWarehouse,
  addStaffAcc,
  addLinhVuc,
  addViet,
  getAllYear,
} = require("../users/book.service");
const { getNewSID, addInfoBook } = require("./staff.service");
const { join } = require("path");
const staffQuery = require("./staff_query");

// routes
router.get("/register", (req, res) => {
  res.render("register", {
    layout: "register_layout.handlebars",
    position: "Staff",
    url: "staffs",
    staff: 1,
  });
});
router.get("/login", (req, res) => {
  res.render("login", {
    layout: "login_layout.handlebars",
    position: "Staff",
    url: "staffs",
  });
});

router.get("/homepage", verifiedToken, (req, res) => {
  res.render("staff_homepage", { layout: "staff_homepage_layout.handlebars" });
});

router.get("/addBook", verifiedToken, (req, res) => {
  getAllBooks((error, books) => {
    getAllAuthors((error, authors) => {
      getAllLinhVuc((error, linhvuc) => {
        getAllViet((error, viet) => {
          getAllYear((error, year) => {
            const _books = mergeInfoBook(books, authors, linhvuc, viet, year);
            res.render("add_book", {
              layout: "add_book_layout.handlebars",
              books: _books,
            });
          });
        });
      });
    });
  });
});
router.post(
  "/addBook",
  verifiedToken,
  upload.single("image"),
  async function (req, res) {
    const infoBook = req.body;

    // await staffService.checkAuthor(infoBook.author, (error, flag) => {
    //     console.log(flag)
    //     if (flag == false) {
    //         res.send("Tác giả không tồn tại hoặc chưa được thêm")
    //     }
    // })
    // await staffService.checkNXB(infoBook.nxb, (error, flag) => {
    //     if (flag == false) res.send("Nhà xuất bản không tồn tại hoặc chưa được thêm")
    // })
    // await staffService.checkBook(infoBook.isbn, (error, flag) => {
    //     if(flag == true) res.send("Sách đã tồn tại")
    // })
    // folder upload
    const imagePath = path.join(__dirname, "../static/images/books");
    // call class Resize
    const fileUpload = new Resize(imagePath, `${infoBook.isbn}.png`);
    if (!req.file) {
      res.status(401).json({ error: "Please provide an image" });
    }
    const filename = await fileUpload.save(req.file.buffer);
    var authors = infoBook.author.split(",");
    // console.log(authors)
    console.log(1);

    addBook(
      infoBook.isbn,
      infoBook.tensach,
      infoBook.price,
      infoBook.nxb,
      infoBook.linhvuc,
      infoBook.author,
      infoBook.year
    );
    // for(const i in authors){
    //     tmp = authors[i].split('-')
    //     // console.log(tmp)
    //     console.log(2)
    //     await addViet(tmp[0], infoBook.isbn)
    // }
    // console.log(3)
    // await addLinhVuc(infoBook.isbn, infoBook.linhvuc)
    // addInfoBook(infoBook.isbn, infoBook.tensach, infoBook.price, infoBook.nxb, infoBook.linhvuc, infoBook.author)
    res.redirect("/staffs/addBook");
  }
);

router.get("/addNXB", verifiedToken, (req, res) => {
  getAllNXB((error, nxb) => {
    res.render("add_nxb", { layout: "add_nxb_layout.handlebars", nxb });
  });
});

router.post("/addNXB", verifiedToken, (req, res) => {
  const nxbInfo = JSON.parse(JSON.stringify(req.body));
  staffService.checkNXB(nxbInfo.namenxb, (error, flag) => {
    if (flag) res.send("Nhà xuất bản đã tồn tại");
  });
  addNXB(nxbInfo.namenxb);

  res.redirect("/staffs/addNXB");
});

router.get("/addAuthor", verifiedToken, (req, res) => {
  getAllAuthors((error, author) => {
    res.render("add_author", {
      layout: "add_author_layout.handlebars",
      tacgia: author,
    });
  });
});

router.post("/addAuthor", verifiedToken, (req, res) => {
  const authorInfo = JSON.parse(JSON.stringify(req.body));

  staffService.checkAID(authorInfo.AID, (error, flag) => {
    if (flag) res.send("AID đã tồn tại");
  });
  addAuthor(
    authorInfo.AID,
    authorInfo["fullName"],
    authorInfo["Email"],
    authorInfo.DOB
  );

  res.redirect("/staffs/addAuthor");
});

router.get("/order", verifiedToken, (req, res) => {
  getAllTransactions((error, transactions) => {
    console.log(transactions);
    const date = parseDate(transactions);
    for (const i in transactions) {
      transactions[i].date = date[i];
    }
    res.render("order", { layout: "order_layout.handlebars", transactions });
  });
});

router.get("/warehouse", verifiedToken, (req, res) => {
  getAllWarehouse((error, kho) => {
    res.render("warehouse", { layout: "add_nxb_layout.handlebars", kho });
  });
});

router.post("/warehouse", verifiedToken, (req, res) => {
  const warehouseInfo = JSON.parse(JSON.stringify(req.body));
  // staffService.checkSID(warehouseInfo.sid, (error, flag) => {
  //     if(!flag) {
  //         res.send("SID không tồn tại");
  //         return;
  //     }
  // })
  staffService.checkMaKho(warehouseInfo.MaKho, (error, flag) => {
    if (flag) {
      res.send("Mã Kho đã tồn tại");
      return;
    }
  });

  addWarehouse(warehouseInfo.MaKho, warehouseInfo.sid);
  getAllWarehouse((error, kho) => {
    res.redirect("/staffs/warehouse");
  });
});

router.get("/view/:require", verifiedToken, (req, res) => {
  var require = req.params.require;
  var date = req.query.date ? req.query.date : "2020-12-31";
  var month = req.query.month ? req.query.month : "1/2020";
  var tmp = date.split("-");
  var day = tmp[2];
  var month = tmp[1];
  var year = tmp[0];
  if (require == 1) {
    staffQuery.getAuthorByMostBookOfDate(date, 1, (error, authors) => {
      console.log(authors);
      res.render("view", {
        layout: "view_layout.handlebars",
        tacgia1: 1,
        tacgia: authors[0],
        requireAuthor: 1,
      });
    });
  } else if (require == 2) {
    staffQuery.getAuthorByMostBookOfDate(date, 2, (error, authors) => {
      res.render("view", {
        layout: "view_layout.handlebars",
        tacgia2: 1,
        tacgia: authors[0],
        requireAuthor: 2,
      });
    });
  } else if (require == 3) {
    staffQuery.getEBookByDate(day, month, year, 1, (error, transactions) => {
      console.log(transactions[0]);
      res.render("view", {
        layout: "view_layout.handlebars",
        trans1: 1,
        sach: transactions[0],
        requireBooks: 3,
      });
    });
  } else if (require == 4) {
    staffQuery.getEBookByDate(day, month, year, 5, (error, transactions) => {
      res.render("view", {
        layout: "view_layout.handlebars",
        trans2: 1,
        sach: transactions[0],
        requireBooks: 3,
      });
    });
  } else if (require == 5) {
    staffQuery.getEBookByDate(month, year, 4, (error, transactions) => {
      res.render("view", {
        layout: "view_layout.handlebars",
        trans4: 1,
        sach: transactions[0],
        requireBooks: 3,
      });
    });
  } else if (require == 7) {
    staffQuery.getEBookByDate(day, month, year, 2, (error, transactions) => {
      res.render("view", {
        layout: "view_layout.handlebars",
        trans5: 1,
        sach: transactions[0],
        requireBooksCount: 3,
      });
    });
  } else if (require == 6) {
    staffQuery.getEBookByDate(day, month, year, 2, (error, transactions) => {
      console.log(transactions[0]);
      res.render("view", {
        layout: "view_layout.handlebars",
        trans6: 1,
        sach: transactions[0],
        requireBooksCount: 3,
      });
    });
  } else if (require == 8) {
    staffQuery.getEBookByDate(day, month, year, 3, (error, transactions) => {
      res.render("view", {
        layout: "view_layout.handlebars",
        trans3: 1,
        sach: transactions[0],
        requireBooks: 3,
      });
    });
  }
  // res.render('view', {layout: 'view_layout.handlebars'})
});

router.get("/logout", (req, res) => {
  localStorage.removeItem("token");
  localStorage.removeItem("fullName");
  localStorage.removeItem("email");
  localStorage.removeItem("id");
  localStorage.removeItem("uid");
  return res.redirect("/staffs/login");
});

router.post("/register", registerSchema, register);
router.post("/login", authenticateSchema, authenticate);
router.get("/", verifiedToken, getAll);
router.get("/current", verifiedToken, getCurrent);
router.get("/:id", verifiedToken, getById);
router.put("/:id", verifiedToken, updateSchema, update);
router.delete("/:id", verifiedToken, _delete);

module.exports = router;

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
  staffService
    .authenticate(req.body)
    .then((staff) => {
      localStorage.setItem("token", staff["token"]);
      localStorage.setItem("fullName", staff["fullName"]);
      localStorage.setItem("email", staff["email"]);
      localStorage.setItem("id", staff["id"]);
      localStorage.setItem("sid", staff["sid"]);
    })
    .then(res.redirect("/staffs/homepage"))
    .catch(next);
}

function registerSchema(req, res, next) {
  const schema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    repeatPassword: Joi.any().valid(Joi.ref("password")).required(),
    key: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function register(req, res, next) {
  getNewSID((error, id) => {
    var _sid = "S" + id.toString();
    console.log(_sid);
    req.body["sid"] = _sid;
    console.log(req.body);
    addStaffAcc(
      id,
      req.body["fullName"],
      req.body["email"],
      req.body["username"],
      null,
      _sid
    );
  });
  if (req.body["key"] != "srdb") res.send("Invalid Staff Key");
  staffService
    .create(req.body)
    .then(res.redirect("/staffs/login"))
    .catch(res.send("Không thể tạo tài khoản !"));
}

function getAll(req, res, next) {
  staffService
    .getAll()
    .then((staffs) => res.json(staffs))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.staff);
}

function getById(req, res, next) {
  staffService
    .getById(req.params.id)
    .then((staff) => res.json(staff))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    fullName: Joi.string().empty(""),
    email: Joi.string().empty(""),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  staffService
    .update(req.params.id, req.body)
    .then((staff) => res.json(staff))
    .catch(next);
}

function _delete(req, res, next) {
  staffService
    .delete(req.params.id)
    .then(() => res.json({ message: "Staff deleted successfully" }))
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

function mergeInfoBook(books, authors, linhvuc, viet, namxuatban) {
  for (i = 0; i < books.length; i++) {
    for (k = 0; k < viet.length; k++) {
      if (k == 0) books[i].author = "";
      if (books[i].ISBN === viet[k].ISBN) {
        for (j = 0; j < authors.length; j++) {
          if (viet[k].AID === authors[j].AID) {
            if (books[i].author == "") {
              books[i].author += authors[j].HoTen;
            } else {
              books[i].author += ", " + authors[j].HoTen;
            }
            break;
          }
        }
      }
    }
  }
  for (const i in books) {
    for (const k in linhvuc) {
      if (books[i].ISBN === linhvuc[k].ISBN) {
        books[i].linhvuc = linhvuc[k].ALinhVuc;
      }
    }
  }

  for (const i in books) {
    books[i]["year"] = "";
    for (const j in namxuatban) {
      if (books[i].ISBN == namxuatban[j].ISBN) {
        if (books[i]["year"] == "") {
          books[i]["year"] += namxuatban[j].ANamSanXuat;
        } else {
          books[i]["year"] += "," + namxuatban[j].ANamSanXuat;
        }
      }
    }
  }
  return books;
}

function parseDate(transactions) {
  var _date = [];
  for (const i in transactions) {
    var date = transactions[i].NgayGio.toString();
    // console.log(JSON.stringify(transactions[i]['NgayGio']))
    var tmp = date.split(" ");
    if (tmp[1] == "Jan") {
      _date += tmp[2] + "/" + "01" + "/" + tmp[3] + " ";
    } else if (tmp[1] == "Feb") {
      _date += tmp[2] + "/" + "02" + "/" + tmp[3] + " ";
    } else if (tmp[1] == "Mar") {
      _date += tmp[2] + "/" + "03" + "/" + tmp[3] + " ";
    } else if (tmp[1] == "Apr") {
      _date += tmp[2] + "/" + "04" + "/" + tmp[3] + " ";
    } else if (tmp[1] == "May") {
      _date += tmp[2] + "/" + "05" + "/" + tmp[3] + " ";
    } else if (tmp[1] == "Jun") {
      _date += tmp[2] + "/" + "06" + "/" + tmp[3] + " ";
    } else if (tmp[1] == "Jul") {
      _date += tmp[2] + "/" + "07" + "/" + tmp[3] + " ";
    } else if (tmp[1] == "Aug") {
      _date += tmp[2] + "/" + "08" + "/" + tmp[3] + " ";
    } else if (tmp[1] == "Sep") {
      _date += tmp[2] + "/" + "09" + "/" + tmp[3] + " ";
    } else if (tmp[1] == "Oct") {
      _date += tmp[2] + "/" + "10" + "/" + tmp[3] + " ";
    } else if (tmp[1] == "Nov") {
      _date += tmp[2] + "/" + "11" + "/" + tmp[3] + " ";
    } else if (tmp[1] == "Dec") {
      _date += tmp[2] + "/" + "12" + "/" + tmp[3] + " ";
    }
  }
  var date_list = _date.split(" ");
  return date_list;
}
