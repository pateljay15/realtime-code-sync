const User = require("../models/user")


exports.getUserById = (req, res, next, id) =>{
    User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }
        req.profile = user
        next()
    })
}


exports.getUser = (req, res) => {
    // TODO get back here for password
    req.profile.salt = undefined
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined
    return res.json(req.profile)
}


exports.userUpdate = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, user) => {
            if(err) {
                return res.status(400).json({
                    error: "You are not authorized to update this user!"
                })
            }
            user.salt = undefined
            user.encry_password = undefined
            res.json(user)
        }
    )
}


// exports.getUsers = (req, res) => {
//     User.find().exec((err, users) => {
//         if(err || !users){
//             return res.status(400).json({
//                 error: "No users found"
//             })
//         }
//         return res.json(users)
//     })
// }