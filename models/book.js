const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseErr } = require("../helpers");

const genreList = ["fantastic", "love"];
const dataRegexp = /^\d{2}-\d{2}-\d{4}$/;

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    genre: {
      type: String,
      enum: genreList,
      required: true,
    },
    date: { type: String, match: dataRegexp, rquired: true },
    owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { versionKey: false, timestamps: false }
);

bookSchema.post("save", handleMongooseErr);

const Book = model("book", bookSchema);

const addSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  favorite: Joi.boolean(),
  genre: Joi.string()
    .valid(...genreList)
    .required(),
  date: Joi.string().pattern(dataRegexp),
});

const updateSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = { addSchema, updateSchema };

module.exports = { Book, schemas };
