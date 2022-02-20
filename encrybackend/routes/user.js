const express = require('express')
const router = express()


const { getUserById, getUser, userUpdate } = require("../controllers/user")
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth")


router.param("userId", getUserById)


router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)

router.put("/user/:userId", isSignedIn, isAuthenticated, userUpdate)

// router.get("/users",  getUsers)
module.exports = router