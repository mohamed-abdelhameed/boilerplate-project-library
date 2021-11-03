/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

const { Schema } = mongoose;

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [{ type: String }]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({},(err,data)=>{
        res.json(data.map(b=>{return {_id:b._id,title:b.title,commentcount:b.comments.length}}));
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title) {
        res.end('missing required field title');
        return;
      }
      let book = new Book({title:title});
      book.save((err,bk)=>{
        res.json(bk);
      });
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      Book.deleteMany({},(err,data)=>{
        if(!err)
          res.end('complete delete successful');
      });
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.findById(bookid,(err,bk)=>{
        if(!bk) {
          res.end('no book exists');
        } else {
          res.json(bk);
        }
      });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(!comment) {
        res.end('missing required field comment');
        return;
      }
      Book.findById(bookid,(err,bk)=>{
        if(!bk) {
          res.end('no book exists');
        } else {
          bk.comments.push(comment);
          bk.save((err,data)=>{
            res.json(data);
          });
        }
      });
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      Book.findByIdAndDelete(bookid,(err,bk)=>{
        if(!bk) {
          res.end('no book exists');
        } else {
          res.end('delete successful');
        }
      });
      //if successful response will be 'delete successful'
    });
  
};
