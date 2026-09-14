const { body } = require("express-validator");

const userCreateValidation = () => {
  return [
    (req, res, next) => {
      const validations = [];
      const step = req.body.step;
      const months = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      const gender = ["Homem", "Mulher", "Prefiro não dizer", "Personalizar"];
      const optionGender = ["Homem", "Mulher", "outros"];

      switch (step) {
        case "name":
          validations.push(
            body("name")
              .notEmpty()
              .withMessage("Digite o nome")
              .bail()
              .matches(/^[a-zA-Z0-9À-ÿ\s]+$/)
              .withMessage("não deve conter caracteres especiais")
              .bail()
              .isString()
              .withMessage("digite um nome válido.")
              .bail()
              .isLength({ min: 3 })
              .withMessage("deve ter no minimo 3 caracteres."),
            body("lastName")
              .optional({ checkFalsy: true })
              .isString()
              .withMessage("digite um sobrenome válido.")
              .bail()
              .isLength({ min: 3 })
              .withMessage("deve ter no minimo 3 caracteres."),
          );
          break;
        case "day":
          validations.push(
            body("day")
              .notEmpty()
              .withMessage("O campo é obrigatório")
              .bail()
              .isNumeric()
              .withMessage("o campo deve ter um número.")
              .bail()
              .isLength({ max: 2 })
              .withMessage("a data nao pode passar de 2 numeros."),
            body("selectGen")
              .notEmpty()
              .withMessage("O campo é obrigatório")
              .bail()
              .isString()
              .withMessage("o campo deve ser válido.")
              .bail()
              .isLength({ min: 3 })
              .withMessage("o campo deve ter pelo menos 3 caracteres.")
              .isIn(gender)
              .withMessage("esse campo nao é valido."),
            body("month")
              .notEmpty()
              .withMessage("O campo é obrigatório")
              .bail()
              .isString()
              .withMessage("o campo deve ser válido.")
              .bail()
              .isLength({ min: 3 })
              .withMessage("o campo deve ter pelo menos 3 caracteres.")
              .isIn(months)
              .withMessage("esse campo nao é valido."),
            body("year")
              .notEmpty()
              .withMessage("O campo é obrigatório")
              .bail()
              .isNumeric()
              .withMessage("o campo deve ter um número.")
              .bail()
              .isLength({ max: 4, min: 4 })
              .withMessage("o ano deve ter 4 numeros."),
          );
          if (req.body.selectGen === "Personalizar") {
            validations.push(
              body("gen")
                .notEmpty()
                .withMessage("este campo é obrigatório.")
                .bail()
                .isString()
                .withMessage("o campo deve conter apenas letras.")
                .bail()
                .isLength({ min: 3 })
                .withMessage("o campo deve ter pelo menos 3 caracteres."),
              body("optGen")
                .notEmpty()
                .withMessage("este campo é obrigatório.")
                .bail()
                .isString()
                .withMessage("o campo deve conter apenas letras.")
                .bail()
                .isLength({ min: 3 })
                .withMessage("o campo deve ter pelo menos 3 caracteres.")
                .isIn(optionGender)
                .withMessage("esse campo nao é valido."),
            );
          }
          break;
        case "email":
          validations.push(
            body("email")
              .notEmpty()
              .withMessage("O campo é obrigatório.")
              .bail()
              .isString()
              .withMessage("O e-mail é obrigatório.")
              .bail()
              .isEmail()
              .withMessage("Insira um e-mail válido."),
          );
          break;
        case "password":
          validations.push(
            body("password")
              .notEmpty()
              .withMessage("O campo é obrigatório")
              .bail()
              .isString()
              .withMessage("A senha é obrigatório")
              .bail()
              .isLength({ min: 5 })
              .withMessage("A senha precisa ter no mínimo 5 caracteres."),
            body("confirmPassword")
              .notEmpty()
              .withMessage("O campo é obrigatório")
              .bail()
              .isString()
              .withMessage("A confirmação de senha é obrigatória.")
              .bail()
              .custom((value, { req }) => {
                if (value != req.body.password) {
                  throw new Error("As senhas não são iguais.");
                }
                return true;
              }),
          );
      }

      Promise.all(validations.map((v) => v.run(req))).then(() => {
        next();
      });
    },
  ];
};

const loginValidation = () => {
  return [
    (req, res, next) => {
      const validations = [];
      const step = req.body.step;
      switch (step) {
        case "email":
          validations.push(
            body("email")
              .notEmpty()
              .withMessage("O campo é obrigatório.")
              .bail()
              .isString()
              .withMessage("O e-mail é obrigatório.")
              .bail()
              .isEmail()
              .withMessage("Insira um e-mail válido."),
          );
          break;
        case "password":
          validations.push(
            body("password")
              .notEmpty()
              .withMessage("O campo é obrigatório")
              .bail()
              .isString()
              .withMessage("A senha é obrigatória"),
          );
          break;
      }
      Promise.all(validations.map((v) => v.run(req))).then(() => {
        next();
      });
    },
  ];
};

const userUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("O nome precisa de pelo menos 3 caracteres."),
    body("password")
      .optional()
      .isLength({ min: 5 })
      .withMessage("A senha precisa ter no mínimo 5 caracteres"),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
