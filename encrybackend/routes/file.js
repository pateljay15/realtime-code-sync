const express = require('express')
const router = express()

const { uploadFile, getFile, getFileById } = require("../controllers/file")
const { isSignedIn, isAuthenticated, isAdmin, isAuthorizedToAccessFile } = require("../controllers/auth")
const { getUserById, getUser, userUpdate } = require("../controllers/user")

router.param("userId", getUserById)

router.post("/upload/:userId", isSignedIn, isAuthenticated, uploadFile)

// router.param("fileId", getFileById)

// router.get("/getFile/:fileId/:key", getFile)

router.get("/getFile/:fileId/:key/:userId", isSignedIn, isAuthenticated, isAuthorizedToAccessFile, getFile)
// router.get("/getFile/:fileId/:key", getFile)


module.exports = router