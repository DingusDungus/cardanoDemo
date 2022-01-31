/**
 * Route for bank.
 */
 "use strict";

 const express = require("express");
 const router = express.Router();
 const website = require("../src/cardanoDemo.js");
 const bodyParser = require("body-parser");
 const { render } = require("ejs");
 const urlencodedParser = bodyParser.urlencoded({ extended: false });
 
 router.get("/index", async (req, res) => {
     let data = {
         title: "Welcome | The Website"
     };
 
     res.render("cardanoDemo/index", data);
 });

 router.post("/wallet/create", urlencodedParser, async (req, res) => {
    let data = {
        title: "Welcome | The Website",
        result: 0
    };

    let wallet = await website.createPool(req.body.name);
    console.log(wallet);
    data.result = wallet.id;

    res.render("cardanoDemo/wallet-show", data);
});

module.exports = router;