const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const sendEmail = require("../helpers/sendEmail");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

// const payload = {
//   id: "65b8e897a84a2449dd67df65",
// };

// const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

// const decodeToken = jwt.decode(token);

// try {
//   const { id } = jwt.verify(token, SECRET_KEY);
//   console.log(id);
// } catch (error) {
//   console.log(error.message);
// }

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPasswordt = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationCode = nanoid();
  console.log("verificationCode:", verificationCode);

  const newUser = await User.create({
    ...req.body,
    password: hashPasswordt,
    avatarURL,
    verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click here to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({ email: newUser.email, name: newUser.name });
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });
  if (!user) {
    throw HttpError(401, "Email not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });
  res.json({
    message: "Email verified success",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(40, "Email not found");
  }

  if (user.verify) {
    throw HttpError(401, "Email already verified");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}"></a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email send success",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({ token });
};

const getCurrent = async (req, res) => {
  const { email, name } = req.user;

  res.json({ email, name });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    message: "Logout success",
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  console.log(req.file);
  const { path: tempUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, fileName);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
