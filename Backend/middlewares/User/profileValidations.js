const { body } = require("express-validator");

const profileUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("o nome deve ter pelo menos 3 caracteres.")
      .bail()
      .isString()
      .withMessage("O nome nao pode conter apenas numeros."),
    body("identify")
      .optional()
      .isLength({ min: 3 })
      .withMessage("o identificador deve ter pelo menos 3 caracteres.")
      .bail()
      .isString()
      .withMessage("O identificador nao pode conter apenas numeros."),
    body("pronouns")
      .optional()
      .isLength({ min: 3 })
      .withMessage("o pronome deve ter pelo menos 3 caracteres.")
      .bail()
      .isString()
      .withMessage("O pronome nao pode conter apenas numeros."),
    body("description")
      .optional()
      .isLength({ min: 3 })
      .withMessage("A descrição deve ter pelo menos 3 caracteres.")
      .bail()
      .isString()
      .withMessage("A descriçao nao pode conter apenas numeros."),
  ];
};

module.exports = {
  profileUpdateValidation,
};
