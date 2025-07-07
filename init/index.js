const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("successful");
}).catch(err => console.log(err));


async function main() {
    await mongoose.connect(MONGO_URL);

}

const initDB = async ()=>{
    await Listing.deleteMany({});
   initData.data= initData.data.map((obj)=>({...obj, owner: "6866563d9834272aa39d2c65"}))
    await Listing.insertMany(initData.data);
    console.log("data was initize ");
}

initDB();