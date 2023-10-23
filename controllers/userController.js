const ModelUser = require("../models/User")

const getAllUsers = async (req, res)=>{
    try {
        const allUser = await  ModelUser.find()
        res.status(200).json(allUser);

    } catch (err) {
        res.status(500).json(err)
    }
}

const deleteUser = async(req, res)=>{
    try {
        const user = await ModelUser.findById(req.params.id)
        res.status(200).json("Delete successfully")
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
  getAllUsers,
  deleteUser,
};