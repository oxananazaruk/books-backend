const bcrypt = require("bcrypt");

const createHashPassword = async (password) => {
  //   const salt = await bcrypt.genSalt(10);
  const result = await bcrypt.hash(password, 10);
  //   console.log(result);
  const compareResult = await bcrypt.compare(password, result);
};

createHashPassword("123456");
