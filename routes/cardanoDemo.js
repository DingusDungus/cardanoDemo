/**
 * Route for demo.
 */
 "use strict";

 const express = require("express");
 const router = express.Router();
 const website = require("../src/cardanoDemo.js");
 const bodyParser = require("body-parser");
 const { render } = require("ejs");
 const urlencodedParser = bodyParser.urlencoded({ extended: false });
 
 router.get("/wallet/index", async (req, res) => {
     let data = {
         title: "Welcome | The Website"
     };
 
     res.render("cardanoDemo/index", data);
 });

 router.get("/wallet/create-wallet", async (req, res) => {
    let data = {
        title: "Welcome | The Website"
    };

    res.render("cardanoDemo/create-wallet", data);
});

 router.get("/wallet/show-wallet", async (req, res) => {
    let data = {
        title: "Welcome | The Website",
        results: []
    }
    let result = await website.getWallets();
    data.results = result;
    console.log(data.results);

    res.render("cardanoDemo/wallet-show", data);
});

router.get("/wallet/delete-wallet/:id", async (req, res) => {
    let data = {
        title: "Welcome | The Website",
        results: []
    }
    await website.deleteWallet(req.params.id);

    res.redirect("/wallet/show-wallet");
});
 router.post("/wallet/create", urlencodedParser, async (req, res) => {
    let data = {
        title: "Welcome | The Website",
        results: []
    }

    let wallet = await website.createWallet(req.body.name, req.body.pass);
    
    res.redirect("/wallet/show-wallet");
});

module.exports = router;