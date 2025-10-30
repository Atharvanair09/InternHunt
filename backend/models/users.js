const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const passportLocalmongoose=require("passport-local-mongoose")

const userSchema=new Schema({
    //username aur password by-default add ho jayega
    email:{
        type:String,
        required:true,
        unique:true,
        googleId: String
    },
    userType:{
        type:String,
        enum:["User","Company"],
        required:true
    },
    userStatus:{
        type:String,
        enum:["Active","Pending","Rejected"],
        default:"Pending"   
    },
});

userSchema.plugin(passportLocalmongoose)

module.exports=mongoose.model("User",userSchema)