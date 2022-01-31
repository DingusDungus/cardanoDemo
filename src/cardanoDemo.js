"use strict";
const mysql = require("promise-mysql");
const config = require("../config/cardanoApp.json");
const CardanocliJs = require("cardanocli-js");
const shelleyGenesisPath = "~/cardano/testnet-shelley-genesis.json";
const options = {}
options.shelleyGenesisPath = shelleyGenesisPath
options.network = "testnet-magic 1097911063"
let db;
let cardanocliJs;

(async function () {
    db = await mysql.createConnection(config);
    cardanocliJs = new CardanocliJs(options);

    process.on("exit", () => {
        db.end();
    });
})();

let cardanoDemo = {
    createWallet: async function (account) {
        try {
            paymentKeys = cardanocliJs.addressKeyGen(account);
            stakeKeys = cardanocliJs.stakeAddressKeyGen(account);
            stakeAddr = cardanocliJs.stakeAddressBuild(account);
            paymentAddr = cardanocliJs.addressBuild(account, {
                "paymentVkey": paymentKeys.vkey,
                "stakeVkey": stakeKeys.vkey
            });
            return cardanocliJs.wallet(account);
        }
        catch (err) {
            console.log(err)
        }
    },
    createPool: async function (name) {
        cardanocliJs.nodeKeyGenKES(name);
        cardanocliJs.nodeKeyGen(name);
        cardanocliJs.nodeIssueOpCert(name);
        cardanocliJs.nodeKeyGenVRF(name);
        return cardanocliJs.pool(name);
    },
    showWallet: async function (wallet) {
        console.log(wallet);
        console.log(wallet.paymentAddr);
    }

};

module.exports = cardanoDemo;