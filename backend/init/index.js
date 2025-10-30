const express = require('express')
const app = express()
const mongoose=require("mongoose")
const initData=require("./data.js")
const Listing=require("../models/listing.js")
const path=require("path")

async function main(){
    await mongoose.connect("mongodb://localhost:27017/InternHunt")
}

main().then(()=>{
    console.log("Connected to MongoDB")
})
.catch((err)=>{
    console.log(err)
})
app.use(express.static(path.join(__dirname, 'init')));

const initdb=async ()=>{
    await Listing.deleteMany({})
    initData.data=initData.data.map((obj)=>(({
        ...obj,
        
    })))
    await Listing.insertMany(initData.data)
    console.log("Data was initialized")

}

initdb()