const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const mapErrors = errors.array().map(({ msg, path }) => ({ msg, path }));
    return res.status(422).json({
      errors: mapErrors,
    });
  } else {
    next();
  }
};

module.exports = validate;
