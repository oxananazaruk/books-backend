const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseErr } = require("../helpers");

const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegex,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    token: { type: String, default: "" },
    avatarURL: { type: String, required: true },
    verify: { type: Boolean, default: false },
    verificationCode: { type: String, default: "" },
  },
  { versionKey: false, timestamps: false }
);

userSchema.post("save", handleMongooseErr);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  emailSchema,
};

const User = model("user", userSchema);

module.exports = {
  schemas,
  User,
};
