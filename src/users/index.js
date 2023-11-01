const { createUser, getAllUser, getUser, updateUser, deleteUser, createSalePerson, deleteSalePerson } = require("./user.controller");
const userRoute = require("./user.route");

module.exports = { createUser, getAllUser, getUser, updateUser, deleteUser, createSalePerson, deleteSalePerson, userRoute };
