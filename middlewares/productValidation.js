const {body} = require("express-validator")

const productCreateValidation = () => {
    return [
      body("qtd")
        .isNumeric()
        .withMessage("A quantidade é obrigatório.")
        .isInt({ min: 1 })
        .withMessage("A quantidade precisa ser maior que 1"),
      body("unity")
        .isIn(['un', 'g'])
        .isString()
        .withMessage("A unidade é obrigatótia"),
      body("description")
        .isString()
        .withMessage("A descrição do produto é obrigatória")
        .isLength({ min: 4 })
        .withMessage("A descrição precisa ter no mínimo 4 caracteres.")
        .isLength({ max: 30 })
        .withMessage("A descrição precisa ter no máximo 30 caracteres."),
      body("value")
        .optional()
        .isNumeric()
        .withMessage("Digite um valor válido")    
    ];
}

//Update validation
const productUpdateValidation = () => {

    return [
      body("qtd")
        .optional()
        .isInt({ min: 1 })
        .withMessage("A quantidade precisa ser maior que 1"),
      body("unity")
        .optional()
        .isIn(["un", "g"])
        .isString()
        .withMessage("A unidade é obrigatótia"),
      body("description")
        .optional()
        .isLength({ min: 4 })
        .withMessage("A descrição precisa ter no mínimo 4 caracteres.")
        .isLength({ max: 30 })
        .withMessage("A descrição precisa ter no máximo 30 caracteres."),
      body("value")
        .optional()
        .isNumeric()
        .withMessage("Digite um valor válido"),
    ];


}

module.exports = {
    productCreateValidation,
    productUpdateValidation,
}