const router = require("express").Router()
const Post = require("../models/Post")

// Create Post
router.post("/", async (req,res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get Single Post
router.get("/:id", async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get All Timeline Posts
router.get("/timeline/all", async (req,res) => {
    try {
        const currentUser = await User.findById(req.body.userId)
        const userPosts = await Post.find({ userId: currentUser._id })
        const friendPosts = await Promise.all(
            currentUser.followings.map(friendId=>{
                return Post.find({ userId: friendId })
            })
        )
        res.json(userPosts.concat(...friendPosts))
    } catch (err) {
        res.status(500).json(err)
    }
})

// Update Post
router.put("/", async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.updateOne({$set:req.body})
            res.status(200).json("Post updated successfully")
        } else {
            res.status(403).json("You can only update your own post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

// Delete Post
router.delete("/", async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.deleteOne({$set:req.body})
            res.status(200).json("Post deleted successfully")
        } else {
            res.status(403).json("You can only delete your own post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

// Like and dislike Post
router.put("/:id/like", async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes:req.params.userId } })
            res.status(200).json("Post liked successfully")
        } else {
             await post.updateOne({ $pull: { likes:req.body.userId } })
             res.status(200).json("Post disliked successfully")
        }
        
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router