const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../helpers/db");
const { promises } = require("fs");
const {
  getAllAuthors,
  getAllNXB,
  getAllstaffs,
  getAllWarehouse,
  getAllStaffAccs,
  addBook,
  addLinhVuc,
  addAuthor,
} = require("../users/book.service");

async function authenticate({ username, password }) {
  const staff = await db.Staff.scope("withHash").findOne({
    where: { username },
  });

  if (!staff || !(await bcrypt.compare(password, staff.hash)))
    throw "Username or password is incorrect";

  // authentication successful
  const token = jwt.sign({ sub: staff.id }, config.secret, { expiresIn: "1d" });
  return { ...omitHash(staff.get()), token };
}

async function getAll() {
  return await db.Staff.findAll();
}

async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  // validate
  if (await db.Staff.findOne({ where: { username: params.username } })) {
    throw 'Username "' + params.username + '" is already taken';
  }
  // hash password
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
    // Promise.reject(await bcrypt.hash(params.password, 10))
  }
  console.log("Tạo thành công");
  // save user
  await db.Staff.create(params);
}

async function update(id, params) {
  const staff = await getUser(id);

  // validate
  const usernameChanged = params.username && user.username !== params.username;
  if (
    usernameChanged &&
    (await db.User.findOne({ where: { username: params.username } }))
  ) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
  }

  // copy params to user and save
  Object.assign(staff, params);
  await staff.save();

  return omitHash(staff.get());
}

async function _delete(id) {
  const staff = await getUser(id);
  await staff.destroy();
}

// helper functions

async function getUser(id) {
  const staff = await db.User.findByPk(id);
  if (!staff) throw "User not found";
  return staff;
}

function omitHash(staff) {
  const { hash, ...userWithoutHash } = staff;
  return userWithoutHash;
}

const checkAuthor = (author, callback) => {
  getAllAuthors((error, authors) => {
    for (const i in authors) {
      var name = authors[i]["Ho"] + " " + authors[i]["Ten"];
      if (name == author) callback(null, true);
    }
  });
  callback(null, false);
};

const checkAID = (AID, callback) => {
  getAllAuthors((error, authors) => {
    for (const i in authors) {
      if (authors[i]["AID"] == AID) {
        callback(null, true);
      }
    }
  });
  callback(null, false);
};

const checkNXB = (nxb, callback) => {
  getAllNXB((error, nxbs) => {
    for (const i in nxbs) {
      if (nxbs[i]["TenNhaXuatBan"] == nxb) callback(null, true);
    }
  });
  callback(null, false);
};

const checkBook = (book, callback) => {
  getAllBooks((error, books) => {
    for (const i in books) {
      if (books[i]["ISBN"] == book) callback(null, true);
    }
  });
  callback(null, false);
};

const checkSID = (SID, callback) => {
  getAllstaffs((error, staffs) => {
    var tmp = Object.values(JSON.parse(JSON.stringify(staffs)));
    for (const i in tmp) {
      if (tmp[i]["SID"] == SID) callback(null, true);
    }
  });
  callback(null, false);
};

const checkMaKho = (Makho, callback) => {
  getAllWarehouse((error, Makhos) => {
    for (const i in Makhos) {
      if (Makhos[i]["SID"] == Makho) callback(null, true);
    }
  });
  callback(null, false);
};

const getNewSID = (callback) => {
  getAllStaffAccs((error, staffs) => {
    callback(null, staffs.length);
  });
};

function addInfoBook(ISBN, tenSach, price, nxb, linhvuc, author) {
  var authors = author.split(",");
  addBook(ISBN, tenSach, price, nxb);
  addLinhVuc(ISBN, linhvuc);
  for (const i in authors) {
    tmp = authors[i].split("-");
    addViet(tmp[0], ISBN);
  }
}

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  checkAuthor,
  checkNXB,
  checkBook,
  checkAID,
  checkSID,
  checkMaKho,
  getNewSID,
  addInfoBook,
};
