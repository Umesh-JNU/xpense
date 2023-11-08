const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const throwError = require("../../utils/errorHandler");
const promiseHandler = require("../../utils/promiseHandler");

const validateEmail = (email) => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  if (!password)
    throwError('Password is required.');

  if (password.length < 8)
    throwError('Password must have at least 8 characters.');

  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d!@#$%^&*(){}[\]<>]).*$/;
  if (!re.test(password))
    throwError('Password must include at least one uppercase, one lowercase, and one number or symbol - !@#$%^&*(){}[]<>');
};

const validateCreate = ({ email, password }) => {
  if (!validateEmail(email))
    throwError('Please provide a valid email address.');

  validatePassword(password);
};

class UserModel {
  constructor() { }

  register = async (data) => {
    validateCreate({ ...data });

    const { rows: [role] } = await promiseHandler(`SELECT id FROM roles WHERE role = $1;`, ['user']);

    data.password = await bcrypt.hash(data.password, 11);
    return (await promiseHandler(`INSERT INTO users(firstname, lastname, email, password, mobile, profile_img, role_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING 
        users.id, 
        users.firstname, 
        users.lastname, 
        users.email, 
        users.mobile, 
        users.profile_img,
        (SELECT role FROM roles WHERE id = users.role_id) as role,
        users.created_at, 
        users.updated_at;`, [data.firstname, data.lastname, data.email, data.password, data.mobile, data.profile_img, role.id])).rows[0];
  }

  // (SELECT jsonb_build_object('id', r.id, 'role', r.role) FROM roles r WHERE r.id = users.role_id) AS "userRole",
  login = async ({ email }) => {
    return (await promiseHandler(`
    SELECT
      u.id,
      u.firstname,
      u.lastname,
      u.email,
      u.mobile,
      u.password,
      u.profile_img,
      u.created_at,
      u.updated_at,
      r.role AS role
    FROM
        users u
    INNER JOIN
        roles r
    ON
        u.role_id = r.id
    WHERE
        email = $1;`, [email])).rows[0];
  }

  getAllUser = () => {

  }

  getUser = (id) => {

  }

  updateUser = (id) => {

  }

  comparePassword = async (enteredPassword, password) => {
    return await bcrypt.compare(enteredPassword, password);
  };

  getJWTToken = (id) => {
    return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TOKEN_EXPIRE,
    });
  };
}

// const userModel = db.define(
//   "User",
//   {
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: {
//         args: true,
//         msg: "Email address already in use!",
//       },
//       validate: {
//         notNull: { msg: "Email is required" },
//         notEmpty: { msg: "Email is required" },
//         isEmail: function (value) {
//           if (value !== '' && !validateEmail(value)) {
//             throw new Error('Invalid email address');
//           }
//         }
//       },
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         len: {
//           args: [8],
//           msg: "Password must be at least 8 characters long",
//         },
//         notNull: { msg: "Password is required" },
//         notEmpty: { msg: "Password is required" },
//       },
//     },
//     fullname: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notNull: { msg: "Name is required" },
//         notEmpty: { msg: "Name is required" },
//       },
//     },

//     mobile_no: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: {
//         args: true,
//         msg: "Phone number is already in use!",
//       },
//       validate: {
//         notNull: { msg: "Phone is required" },
//         notEmpty: { msg: "Phone is required" },
//       },
//     },
//     country: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notNull: { msg: "Country is required" },
//         notEmpty: { msg: "Country is required" },
//       },
//     },
//     city: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notNull: { msg: "City is required" },
//         notEmpty: { msg: "City is required" },
//       },
//     },
//     avatar: {
//       type: DataTypes.STRING,
//       defaultValue: random_profile()
//     }
//   },
//   {
//     timestamps: true,
//     paranoid: true,
//     defaultScope: {
//       attributes: { exclude: ["password", "deletedAt"] },
//     },
//     scopes: {
//       withPassword: {
//         attributes: { include: ["password"] },
//       },
//     },
//   }
// );

// userModel.beforeSave(async (user, options) => {
//   console.log("user", user, user.changed("password"));
//   if (user.changed("password")) {
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//   }
// });
// userModel.prototype.getJWTToken = function () {
//   return jwt.sign({ userId: this.id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_TOKEN_EXPIRE,
//   });
// };

// userModel.prototype.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userModel.getUpdateFields = function (userData) {
//   const attributes = Object.keys(this.rawAttributes);
//   const defaultFields = [
//     "id",
//     "createdAt",
//     "updatedAt",
//     "deletedAt",
//     "password",
//     "role",
//   ];
//   const updateFields = attributes.filter(
//     (attribute) => !defaultFields.includes(attribute)
//   );

//   return Object.fromEntries(
//     Object.entries(userData).filter(([key, value]) =>
//       updateFields.includes(key)
//     )
//   );
// };

// userModel.getHandler = async function (userId, next) {
//   const handler = await this.findByPk(userId, {
//     include: [{
//       model: roleModel,
//       as: "userRole",
//       attributes: ["role"]
//     }],
//   });

//   if (!handler) return next(new ErrorHandler("User with specified role not found.", 404));

//   return handler;
// };

// const roleModel = db.define(
//   "Role",
//   {
//     role: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notNull: { msg: "Role is required" },
//         notEmpty: { msg: "Role is required" },
//       },
//     }
//   },
//   { timestamps: true }
// )

// const otpModel = db.define(
//   "OTP",
//   {
//     otp: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notNull: { msg: "OTP cannot be null." },
//         notEmpty: { msg: "OTP cannot be empty." },
//       },
//     }
//   },
//   { timestamps: true }
// );

// otpModel.prototype.isValid = async function (givenOTP) {
//   const user = await userModel.findByPk(this.userId);
//   if (!user) return false;

//   const otpValidityDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
//   const currentTime = new Date().getTime();
//   const otpCreationTime = new Date(this.createdAt).getTime();

//   // Calculate the time difference between current time and OTP creation time
//   const timeDifference = currentTime - otpCreationTime;

//   // Check if the time difference is within the OTP validity duration
//   return timeDifference <= otpValidityDuration;
// };

// roleModel.hasMany(userModel, { foreignKey: "roleId", as: "user" });
// userModel.belongsTo(roleModel, { foreignKey: "roleId", as: "userRole" });

// userModel.hasOne(otpModel, { foreignKey: "userId", as: "otp" });
// otpModel.belongsTo(userModel, { foreignKey: "userId", as: "user" });

// module.exports = { userModel, roleModel, otpModel };
module.exports = new UserModel();
