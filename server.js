require("dotenv").config();
const express = require("express");
const app = express();
const request = require("request").defaults({ encoding: null });
const twitterConfig = require('./twitter-config');
const twitter = require('twitter-lite');
const twitterClient = new twitter(twitterConfig);
const mongoose = require("mongoose");
const Posts = require("./models/posts");
const he = require("he");
const req = require("express/lib/request");

mongoose.connect(process.env.DB, { useUnifiedTopology:true, useNewUrlParser:true }, () => console.log("Banco de dados conectado!"));

const autoPost = () => {
  console.log("Verificando novos posts");
  request(process.env.URL, { json:true }, async (err, res, body) => {
    if (err) return console.log(err);

    body.reverse().forEach(async p => {
      let DBPost = await Posts.findOne({ postID:p.id });

      if(!DBPost) DBPost = await Posts.create({ postID:p.id });

      // Twitter
      if(DBPost.twitter === false){
        twitterClient.post('statuses/update', { status: `${he.decode(p.title.rendered.replaceAll(/(<([^>]+)>)/ig, ""))}\n\n${he.decode(p.excerpt.rendered.replaceAll(/(<([^>]+)>)/ig, ""))}\n${p.link}?twitter=${DBPost.id}` }).then(async result => {
          DBPost.twitter = true;
          DBPost.save();
        }).catch(console.error);
      }
    });
  });
  console.log("Posts verificados");
};

app.get("/", (req, res) => {
  res.send(`<style>body{background:#1c1c1c;}h1{font-family:sans-serif; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:#fff;}h1:after{background:green; content:""; width:25px; height:25px; display:block; position:absolute; right:0; top:50%; transform:translate(120%, -50%); border-radius:50%;}</style><h1>CONECTADO</h1>`);
});

app.post("/daily", (req, res) => {
  
});

setInterval(autoPost, 120000);

app.listen(process.env.PORT || 3000, console.log("Conectado!"))
