const {body} = require("express-validator")

const listCreateValidation = () => {
    return [
      body("title")
        .not()
        .equals("undefined")
        .withMessage("O nome da lista é obrigatório.")
        .isString()
        .withMessage("O nome da lista é obrigatório.")
        .isLength({ min:4 })
        .withMessage("O nome da lista precisa ter no mínimo 4 caracteres."),
    ]
}
const listUpdateValidation = () => {
    return [
      body("title")
        .optional()
        .isString()
        .withMessage("O nome da lista é obrigatório.")
        .isLength({ min:4 })
        .withMessage("O nome da lista precisa ter no mínimo 4 caracteres."),
    ]
}

module.exports = {
  listCreateValidation,
  listUpdateValidation,
};