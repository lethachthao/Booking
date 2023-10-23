const express = require("express")
const userController = require("../controllers/userController")
const middlewareController = require("../controllers/middlewareController")

const router = express.Router();

//GET ALL USER
router.get("/", middlewareController.verifyToken , userController.getAllUsers)

//DELETE USER
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, userController.deleteUser)



module.exports = router;