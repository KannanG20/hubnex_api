const router = require("express").Router();
const { body } = require('express-validator');

const userRolesController = require("../controllers/userRolesController")

// Validate Response Data
const validateData = [
    body("Name").trim().isAlpha().withMessage("firstname should not consist numeric values").isLength({ max: 15 }).withMessage("maximum 15 characters allowed"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("phoneNo").trim().isNumeric().withMessage("Only Numbers allowed").isMobilePhone().withMessage("Invalid mobile number")  
]


router.post('/user-role', userRolesController.POST_ROLE);
router.get('/user-roles', userRolesController.GET_ROLES);
router.put('/user-role/:_id', userRolesController.UPDATE_ROLE)
router.delete('/user-role/:_id', userRolesController.DELETE_ROLE)

module.exports =router