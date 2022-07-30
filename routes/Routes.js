const express = require("express")
const router = express()

router.use("/api/users", require("./UserRoutes"))
router.use("/api/lists", require("./ListRoutes"));
router.use("/api/products", require("./ProductRoutes"));

//Test route
router.get("/", (req, res) => {
    res.send("Carregando...")
})


module.exports = router