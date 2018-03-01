
var mongoose = require('mongoose');

var noteSchema = mongoose.Schema({
    
    title: String,
    description:String,
    content:Number,
    id:Date
  });

  var Note = mongoose.model('Note', noteSchema);
  module.exports = Note