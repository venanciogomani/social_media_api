const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")

// Register
router.post("/register", async (req, res) => {
    try{
        // Generate hashed password
        //const salt = await bcrypt.genSalt(10)
        //const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
        // create new user
        const newUser = await new User({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password
        })

        // save user and respond
        const user = await newUser.save()
        res.status(200).json(user)
    }catch(err){
        res.status(500).send(err)
    }
});

// LOGIN
router.post("/login", async (req,res) => {
    try {
        const user = await User.findOne({
            email:req.body.email
        })
        !user && res.status(404).send("User not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).send("Wrong password")

        res.status(200).json(user)
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router;