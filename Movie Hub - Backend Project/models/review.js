
const mongoose=require('mongoose');

const reviewSchema=new mongoose.Schema({
    
    username:{type:String,required:true},
    title:{type:String,required:true},
    poster:{type:String},
    text:{type:String,required:true},
    createdAt:{type:Date,default:Date.now}
});
module.exports=mongoose.model("review",reviewSchema);