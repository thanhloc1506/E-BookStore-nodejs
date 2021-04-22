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
  getAllUserAccs,
  getAllUsers,
  getAllTransactions,
  getAllBooks,
  getAllTransactions2,
} = require("./book.service");

async function authenticate({ username, password }) {
  const user = await db.User.scope("withHash").findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.hash)))
    throw "Username or password is incorrect";

  // authentication successful
  const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: "2h" });
  const _user = {
    id: user.get().id,
    fullName: user.get().fullName,
    email: user.get().email,
    uid: user.get().uid,
  };
  // _user = JSON.parse(_user)
  const id = user.get().id;
  const fullName = user.get().fullName;
  const email = user.get().email;
  const uid = user.get().uid;
  return { id, fullName, email, uid, token };
  // return token
}

async function getAll() {
  return await db.User.findAll();
}

async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  // validate
  if (await db.User.findOne({ where: { username: params.username } })) {
    throw 'Username "' + params.username + '" is already taken';
  }
  // hash password
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
    // Promise.reject(await bcrypt.hash(params.password, 10))
  }
  console.log("Tạo thành công");
  // save user
  await db.User.create(params);
}

async function update(id, params) {
  const user = await getUser(id);

  // // validate
  // const usernameChanged = params.username && user.username !== params.username;
  // if (
  //   usernameChanged &&
  //   (await db.User.findOne({ where: { username: params.username } }))
  // ) {
  //   throw 'Username "' + params.username + '" is already taken';
  // }

  // // hash password if it was entered
  // if (params.password) {
  //   params.hash = await bcrypt.hash(params.password, 10);
  // }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();

  return omitHash(user.get());
}

async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

// helper functions

async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}

function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}

const getNewUID = (callback) => {
  getAllUserAccs((error, users) => {
    callback(null, users.length);
  });
};

const mergeUser = (user, callback) => {
  getAllUsers((error, customers) => {
    for (const j in customers) {
      if (user["UID"] == customers[j]["UID"]) {
        user["Phone"] = customers[j]["Phone"];
        user["DiaChi"] = customers[j]["DiaChi"];
        callback(null, user);
      }
    }
  });
  callback(true, user);
};

const getCustomerByUID = (UID, callback) => {
  getAllUsers((error, users) => {
    for (const i in users) {
      // console.log(UID)
      if (users[i]["UID"] == UID) {
        // console.log(users[i])
        var user = users[i];
        callback(null, user);
      }
    }
  });
  callback(true, "");
};

const getTransactionByUID = (UID, callback) => {
  let _transaction = [];
  getAllTransactions((error, transaction) => {
    for (const i in transaction) {
      if (transaction[i].UID == UID) {
        _transaction.push(transaction[i]);
      }
    }
    callback(null, _transaction);
  });
};

const getTransactionByUID2 = (UID, callback) => {
  let _transaction = [];
  getAllTransactions2(UID, (error, transaction) => {
    for (const i in transaction) {
      if (transaction[i].UID == UID) {
        _transaction.push(transaction[i]["ISBN"]);
      }
    }
    callback(null, _transaction);
  });
};

const mergeTrans = (transactions, books, callback) => {
  for (const i in transactions) {
    for (const j in books) {
      if (transactions[i].ISBN == books[j].ISBN) {
        transactions[i]["TenSach"] = books[j]["TenSach"];
        transactions[i]["price"] = books[j]["GiaTien"];
        // console.log(transactions)
      }
    }
  }
  callback(null, transactions);
};

const getPrice = (bookInput, callback) => {
  getAllBooks((error, books) => {
    for (const i in books) {
      for (const j in bookInput) {
        if (books[i].ISBN == bookInput[j].ISBN) {
          bookInput[j]["GiaTien"] = books[i].GiaTien;
        }
      }
    }
    callback(null, bookInput);
  });
};

const getHoaDon = (callback) => {
  var num = Math.floor(Math.random() * 9999990) + 1000000;
  callback(null, num);
};

const mergeCart = (carts, callback) => {
  var flag = 0;
  getAllBooks((error, books) => {
    for (const j in books) {
      for (const i in carts) {
        // console.log(carts[i].isbn, books[j].ISBN)
        if (carts[i].isbn == books[j].ISBN) {
          carts[i]["TenSach"] = books[j]["TenSach"];
          carts[i]["GiaTien"] = books[j]["GiaTien"];
        }
      }
    }
    // console.log(carts)
    callback(null, carts);
  });
};

const calBill = (carts, callback) => {
  var sum = 0;
  for (const i in carts) {
    sum += carts[i]["tong"];
  }
  callback(null, sum);
};

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  getNewUID,
  mergeUser,
  getCustomerByUID,
  getTransactionByUID,
  getTransactionByUID2,
  mergeTrans,
  getPrice,
  getHoaDon,
  mergeCart,
  calBill,
};
