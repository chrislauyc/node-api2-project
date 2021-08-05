// implement your server here
// require your posts router and connect it here
const express = require("express");
const cors = require("cors")
const server = express();
const postsRouter = require("./posts/posts-router");

server.use(express.json()); //looks like you can just pass in the middleware in the top server
server.use(cors());
server.use("/api",postsRouter);

module.exports=server;