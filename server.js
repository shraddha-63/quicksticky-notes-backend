const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
var cors = require('cors');
const app = express();
// app.use(express.static(path.join(__dirname, 'build')));
const Note  = require('./src/models/Note')

 
var mongoose = require('mongoose');
const mongoUrl = process.env.NODE_ENV === "production" ? 
                    "mongodb://admin:admin@ds129936.mlab.com:29936/notes"
                    :
                    'mongodb://localhost/notes'

console.log(mongoUrl)
mongoose.connect(mongoUrl);
var db = mongoose.connection;
db.on('error',console.error.bind('connection error'));
db.once('open',()=>{

  app.use(cors());

  app.use(bodyParser.json())

  app.get('/notes', function (req, res) {
    Note.find({},(err,data)=>{
      if(err){
        // console.log(err)
        return res.json([])
      }
      // console.log(res.json(data))
      return res.json(data)
    })
  
    });
    
    app.post('/save',function(req,res){
    
      const sampleNotes = new Note(req.body)       
      sampleNotes.save((err,doc)=>{
        if(err){
          return res.json('not saved')
        }
        res.json('saved')
      })

    });


    app.post('/edit', function(req,res){
    
      const {activeNote} = req.body;   
      /* callback */   
    
        /*Note.findOneAndUpdate({'id': activeNote.id }, activeNote, function(err,doc){
  
          if(err){
            return res.json('not saved')
          }
          res.json('saved')

          Note.find({},(err,docs)=>{
            console.log('shdsds')
          })
        })*/

      /* promise */

         Note.findOneAndUpdate({'id':activeNote.id}, activeNote).exec()
        .then(doc=>{
          console.log('data is saved')
          return Note.find({}) //promise chaining
        })
        .then(docs => {
          //console.log(docs)
          res.json(docs)
        })
        .catch(err =>{
          console.log(err)
          return res.json('not saved')
        })
    })

  /*async await*/
  /*app.post('/edit',async function(req,res){
    try{
      const {activeNote} = req.body;   
      const doc =  await Note.findOneAndUpdate({'id':activeNote.id}, activeNote).exec()

      console.log(doc)
      console.log('sjdjsdj')
      // if(!doc){
      //   return res.json('error aayi')
      // }
      const docs = await Note.find({}).exec()
      console.log(docs)
      res.json(docs)

    } catch(e) {
      console.log(e)
      res.json('error aayi')
    }

})*/


    app.post('/delete',function(req,res){
    
      console.log(req.body)
      Note.remove({'id':req.body.id}).exec()
      .then(doc =>{
         return Note.find({})
      })
      .then(docs =>{        
        return res.json(docs)
      })
      .catch(err=>{
        return res.json([])
      })
    
      // Note.remove({'id':req.body.id},function(err,doc){
      //   if(err){
      //     return res.json('not saved')
      //   }
      //   res.json('saved')
      // })

    })
  
    //  app.get('/test', function (req, res) {
  //    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  //  });
    
    app.listen( process.env.NODE_ENV === 'production'? process.env.PORT : 8080, ()=>{
        console.log('server runs')
    });
  })



  // const sampleNotes = new Note(
  //   {
  //   title:'second note',
  //   description:"second note of mine",
  //   content:22,
  //   id:1519461892637,
  //   deleted:false 
  //   }
  // )
  // sampleNotes.save((err,res)=>{
  //   if(err){
  //     console.log(err)
  //     return
  //   }
  //   console.log(res)
  // })
