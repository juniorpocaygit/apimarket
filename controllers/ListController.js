const List = require("../models/List")
const User = require("../models/User")
const Product = require("../models/Product")

const mongoose = require("mongoose")

//Insert a list, whith an user related to id
const insertList = async (req, res) => {
 
  const { title } = req.body

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  //Create a list
  const newList = await List.create({
    title,
    userId: user._id,
    userName: user.name,
  });

  //if List was created successfully, return data
  if (!newList) {
    res
      .status(422)
      .json({ errors: ["Houve um problema, tente novamente mais tarde."] });
      return
  }

  res.status(201).json(newList);
};

//Remove a list from DB
const deleteList = async(req, res) => {

  const {id} = req.params
  const reqUser = req.user

  try {
     const list = await List.findById(mongoose.Types.ObjectId(id));
    
     //Check if list exists
     if (!list) {
       res.status(404).json({ errors: ["Lista não encontrada"] });
       return;
     }

     //Check if list belongs to user
     if (!list.userId.equals(reqUser._id)) {
       res
         .status(422)
         .json({ errors: ["Ocorreu um erro, tente novamente mais tarde."] });
       return;
     }

     await List.findByIdAndDelete(list._id);

     res.status(200).json({ id: list._id, message: "Lista excluida com sucesso" });
    
  } catch (error) {

     res.status(404).json({ errors: ["Lista não encontrada"] });
     return;
  }
}

//Get all lists
const getAllLists = async(req, res) => {

  const lists = await List.find({}).sort([["createdAt", -1]]).exec()

  return res.status(200).json(lists)

}

//Get user lists
const getUserLists = async(req, res) => {

  const {id} = req.params

  const lists = await List.find({ userId: id }).sort([["createdAt", -1]]).exec()

  return res.status(200).json(lists);
}

//Get list and product by list id
const getListById = async(req, res) => {

  const {id} = req.params

  const list = await List.findById(mongoose.Types.ObjectId(id))

  //Check list exixts
  if (!list) {

    res.status(404).json({errors: ["Lista não encontrada."]})
    return
  }

  return res.status(200).json({list});
}

//Update a list
const updateList = async(req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;

  const list = await List.findById(id);

  //Check if list exists
  if (!list) {
    res.status(404).json({ errors: ["Lista não encontrada"] });
    return;
  }

  //Check if list belongs to user
  if (!list.userId.equals(reqUser._id)) {
    res.status(404).json({ errors: ["Ocorreu um erro, por favor tente novamente mais tarde."] });
    return;
  }

  //Check if title submit
  if(title){
    list.title = title
  }

  await list.save()
  res.status(200).json({list, message:"Lista atualizada com sucesso"})
}

module.exports = {
  insertList,
  deleteList,
  getAllLists,
  getUserLists,
  getListById,
  updateList,
};