const User = require("../models/User")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const mailer = require("../modules/mailer")
const mongoose = require("mongoose")

const jwtSecret = process.env.JWT_SECRET

//Generate Token
const generateToken = (id) => {
    return jwt.sign({id}, jwtSecret,{
        expiresIn: "7d",
    })    
}

//Register user and sign in
const register = async (req, res) => {
   const {name, email, password} = req.body

   //Check if user exists
   const user = await User.findOne({email})
   if (user) {
    res.status(422).json({errors: ["Esse usuário já existe, por favor utilize outro email. "]})
    return
   }

   //Generate password hash
   const salt = await bcrypt.genSalt()
   const passwordHash = await bcrypt.hash(password, salt)

   //Create user
   const newUser = await User.create({
        name,
        email,
        password: passwordHash
   })

   //If user was created succesfully, return the token
   if (!newUser) {
        res.status(422).json({errors: ["Houve um erro, por favor tente novamente mais tarde."]})
        return
   }
   res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id)
   })
}

//Sign user in
const login = async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    //Check if user exists
    if(!user){
        res.status(404).json({errors: ["Usuário não encontrado"]})
        return
    }

    //Check if password matches
    if (!(await bcrypt.compare(password, user.password))) {
        res.status(422).json({errors: ["Senha inválida."]})
        return
    }

    //Return user with token
    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id)
   })
}

//Get current logger in user
const getCurrentUser = async (req, res) => {
    const user = req.user

    res.status(200).json(user)
}

//update an user
const update = async (req, res) => {
   const { name, password } = req.body;

   let profileImage = null;

   if (req.file) {
     user.profileImage = req.file.filename;
   }

   const reqUser = req.user;

   const user = await User.findById(mongoose.Types.ObjectId(reqUser._id)).select("-password");

   if (name) {
     user.name = name;
   }
   if (password) {
     //Generate password hash
     const salt = await bcrypt.genSalt();
     const passwordHash = await bcrypt.hash(password, salt);

     user.password = passwordHash;
   }
  //  if (profileImage) {
  //    user.profileImage = profileImage;
  //  }

   await user.save();
   res.status(200).json(user);
    
}

//Get user by id
const getUserById = async(req, res) => {

    const {id} = req.params

    try {
      const user = await User.findById(mongoose.Types.ObjectId(id)).select("-password")
      

      //Check if user exists
      if (!user) {
        res.status(404).json({ errors: ["Usuário não encontrado."] });
        return;
      }
      res.status(200).json(user);

    } catch (error) {
        res.status(404).json({ errors: ["Usuário não encontrado."] });
        return;
    }
}

//Get all users
const getAllUsers = async(req, res) => {

    const user = await User.find({}).sort([["createdAt", -1]]).select("-password").exec()

    res.status(200).json(user);
}

//Forgot_password
const forgotPassword = async(req, res) => {
    const {email} = req.body

    try {

        const user = await User.findOne({email})

        if(!user){
          res.status(400).json({ errors: ["Usuário não encontrado."] });  
          return
        }

        const tokenForgot = crypto.randomBytes(22).toString('hex')

        const now = new Date()
        now.setHours(now.getHours() + 1)

        await User.findByIdAndUpdate(user.id, {
          $set: {
            passwordResetToken: tokenForgot,
            passwordResetExpires: now,
          },
        });

        mailer.sendMail({
            to: email,
            from: 'juniorpocay@gmail.com',
            template:'auth/forgot_password',
            context:{tokenForgot},
        }, (err) => {
            if(err){
                return res.status(400).json({ errors: ["Não foi possível enviar o email de recuperação de senha."] })
            }
        })
        res.status(200).json({ message: "Email enviado com sucesso!" });  

    } catch (error) {
        res.status(400).json({ errors: ["Erro ao recuperar a senha!"] });
    }
}

//Reset Password
const resetPassword = async(req, res) => {
    const {email, resetToken, password } = req.body

    try {

        const user = await User.findOne({email})

        //Verify user exists
        if (!user) {
            res.status(400).json({ errors: ["Usuário não encontrado."] });
            return
        }
        //Verify token is valid
        if(resetToken !== user.passwordResetToken){
            res.status(400).json({ errors: ["Token inválido."] });
            return
        }
        //Verify token is not expired
        const now = new Date()
        if (now > user.passwordResetExpires) {
            res.status(400).json({ errors: ["Esse token está expirado, gere um novo."] });
            return
        }
        if (password) {
          //Generate password hash
          const salt = await bcrypt.genSalt();
          const passwordHash = await bcrypt.hash(password, salt);

          user.password = passwordHash;
        }
     
        await user.save()

        res.status(200).json({ user, message: "Senha atualizada com sucesso!" });

        
    } catch (error) {
        res.status(400).json({ errors: ["Erro ao resetar a senha, tente novamente mais tarde"] });
        return
    }
}



module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
  getAllUsers,
  forgotPassword,
  resetPassword,
};
