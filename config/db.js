const mongoose = require("mongoose")
const dbMongo = process.env.MONGODB_URI

//Connection
const conn = async () => {
    try {
        
        const dbConn = await mongoose.connect(
          `${dbMongo}`
        );
        console.log("Conectou ao banco")

        return dbConn

    } catch (error) {
        console.log(error) 
    }
}

conn()
module.exports = conn