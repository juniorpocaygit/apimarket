const mongoose = require("mongoose")
const dbMongo = process.env.MONGODB_URI

//Connection
const conn = async () => {
    try {
        
        const dbConn = await mongoose.connect(
          `mongodb+srv://juniorpocay:EibR4VSeBcpU6c2n@cluster0.vqtmj.mongodb.net/?retryWrites=true&w=majority`
        );
        console.log("Conectou ao banco")

        return dbConn

    } catch (error) {
        console.log(error) 
    }
}

conn()
module.exports = conn