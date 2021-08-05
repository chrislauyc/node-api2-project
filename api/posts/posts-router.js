// implement your posts router here
const express = require('express');
const { restart } = require('nodemon');
const model = require("./posts-model");
const postsRouter = express.Router();

postsRouter.get("/posts",(req,res)=>{
    model.find()
    .then((posts)=>{
        res.status(200).json(posts);
    })
    .catch(()=>{
        res.status(500).json({message:"The post information could not be retrieved"})
    });
}); 
postsRouter.post("/posts",(req,res)=>{
    const {title, contents} = req.body;
    if(title&&contents){
        model.insert(req.body)
        .then((id)=>{
            res.status(201).json({...req.body,id});
        })
        .catch(()=>{
            res.status(500).json({message:"Please provide title and contents for the post"})
        });
    }
    else{
        res.status(400).json({message:"Please provide title and contents for the post"})
    }
});

postsRouter.get("/posts/:id",(req,res)=>{
    // {
    //   id: 1,
    //   title: 'I wish the ring had never come to me. I wish none of this had happened.',
    //   contents: 'Guess who said this',
    //   created_at: '2021-06-01 14:06:15',
    //   updated_at: '2021-06-01 14:06:15'
    // }
    model.findById(req.params.id)
    .then((post)=>{
        if(post){
            res.status(200).send(post);
        }
        else{
            res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
    })
    .catch(()=>{
        res.status(500).json({ message: "The post information could not be retrieved" });
    });
});

postsRouter.put("/posts/:id",(req,res)=>{
    const {title, contents} = req.body;
    if(title&&contents){
        model.update(req.params.id,req.body)
        .then((count)=>{
            if(count!==0){
                // exists
                res.status(200).json({...req.body,id:Number(req.params.id)});
            }
            else{
                res.status(404).json({ message: "The post with the specified ID does not exist" });
            }
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).json({ message: "The post information could not be modified"});
        });
    }
    else{
        res.status(400).json({ message: "Please provide title and contents for the post" });
    }
});

postsRouter.delete("/posts/:id",(req,res)=>{
    model.findById(req.params.id)
    .then((post)=>{
        if(post){
            model.remove(req.params.id)
            .then(()=>{
                res.status(200).json(post);
            })
        }
        else{
            res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
    })
    .catch(()=>{
        res.status(500).json({ message: "The post could not be removed" });
    });
});
postsRouter.get("/posts/:id/comments",(req,res)=>{
    model.findById(req.params.id)
    .then((post)=>{
        if(post){
            model.findPostComments(req.params.id)
            .then((comments)=>{
                res.status(200).json(comments);
            })
            .catch(()=>{
                res.status(500).json({ message: "The comments information could not be retrieved"});
            });
        }
        else{
            res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
    })
})
module.exports=postsRouter;