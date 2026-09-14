const { body } = require("express-validator");

const postValidation = () => {
  return [
    body().custom((value, { req }) => {
      const image = req.files;
      const poll = req.body.pollText;

      if (image?.length !== 0 && poll !== "false") {
        throw new Error("Não se pode enviar imagens e listas ao mesmo tempo");
      }
      return true;
    }),
  ];
};

module.exports = {
  postValidation,
};
