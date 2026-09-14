const { body } = require("express-validator");

const videoValidation = () => {
  return [
    body("title").notEmpty().withMessage("Escreva um titulo para o video."),
    body("description").optional(),
    body("tag").custom((value) => {
      if (value === "") throw Error("O Video precisa de pelomenos uma Tag.");

      const tagSplit = value.split(",").map((t) => t.trim());

      for (const tag of tagSplit) {
        if (tag.length < 3) {
          throw new Error("todas as tags devem ter no minimo 3 caracteres.");
        }
      }
      return true;
    }),
    body("copy")
      .notEmpty()
      .withMessage("Escreva o nome do autor original.")
      .bail()
      .isLength({ min: 3 })
      .withMessage("O nome do autor deve ter no minimo 3 caracteres."),
  ];
};

module.exports = {
  videoValidation,
};
