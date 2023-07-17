const express = require('express');
const app = express();

app.get("/",(req,res) => {
    res.send("Wassup in browser");
})

app.listen(3000, () =>{
    console.log(`Application is running on: localhost:3000`);
})