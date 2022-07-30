const Product = require("../models/Product")
const List = require("../models/List")


const mongoose = require("mongoose")

//Insert a product, whith an list related to id
const insertProduct = async (req, res) => {
 
  const {id} = req.body
  
  const list = await List.findById(mongoose.Types.ObjectId(id));
  
  const {qtd, unity, description, value} = req.body

  //Create a product
  const newProduct = await Product.create({
    qtd,
    unity,
    description,
    value,
    listId: list._id,
    listName: list.title,
  });

  //if product was created successfully, return data
  if (!newProduct) {
    res
      .status(422)
      .json({ errors: ["Houve um problema, tente novamente mais tarde."] });
    return;
  }
  res.status(201).json(newProduct);
};

//Remove a list from DB
const deleteProduct = async(req, res) => {

  const {id} = req.params
  
  try {
     const product = await Product.findById(mongoose.Types.ObjectId(id));
    
     //Check if list exists
     if (!product) {
       res.status(404).json({ errors: ["Produto não encontrada"] });
       return;
     }
     await Product.findByIdAndDelete(product._id);

     res.status(200).json({ id: product._id, message: "Produto excluido com sucesso" });
    
  } catch (error) {

     res.status(404).json({ errors: ["Produto não encontrada"] });
     return;
  }
}

//Update a Product
const updateProduct = async(req, res) => {
  const { id } = req.params;
  const { qtd, unity, description, value } = req.body;

  const product = await Product.findById(id);

  //Check if list exists
  if (!product) {
    res.status(404).json({ errors: ["Produto não encontrado"] });
    return;
  }
  //Check if amount submit
  if(qtd){
    product.qtd = qtd
  }
  //Check if unity submit
  if(unity){
    product.unity = unity
  }
  //Check if description submit
  if(description){
    product.description = description
  }
  //Check if value submit
  if(value){
    product.value = value
  }
  await product.save()
  res.status(200).json({product, message:"Lista atualizada com sucesso"})
}

//Get product by list id
const getProductByListId = async(req, res) => {

  const {id} = req.params

  const products = await Product.find({ listId: id }).sort([["createdAt", -1]]).exec();

  //Check list exixts
  if (!products) {

    res.status(404).json({errors: ["Lista não encontrada."]})
    return
  }

  return res.status(200).json({products});
}





module.exports = {
  insertProduct,
  deleteProduct,
  updateProduct,
  getProductByListId,
};