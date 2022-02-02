"use strict";
const mysql = require("promise-mysql");
const config = require("../config/cardanoApp.json");
const CardanocliJs = require("cardanocli-js");
const { Seed, WalletServer } = require('cardano-wallet-js');
const { UtxoStatisticsWallet } = require('cardano-wallet-js/dist/wallet/utxo-statistics-wallet');
const shelleyGenesisPath = "~/cardano/testnet-shelley-genesis.json";
const options = {}
options.shelleyGenesisPath = shelleyGenesisPath
options.network = "testnet-magic 1097911063"
let db;
let cardanocliJs;
let walletServer;

(async function () {
    db = await mysql.createConnection(config);
    cardanocliJs = new CardanocliJs(options);
    walletServer = await WalletServer.init('http://localhost:1339/v2');

    process.on("exit", () => {
        db.end();
    });
})();

let cardanoDemo = {
    createWallet: async function (name, passphrase) {
        try {
            let recoveryPhrase = Seed.generateRecoveryPhrase();
            let mnemonic_sentence = Seed.toMnemonicList(recoveryPhrase);

            let wallet = await walletServer.createOrRestoreShelleyWallet(name, mnemonic_sentence, passphrase);
            return wallet;
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
    getWallet: async function (index) {
        console.log("Get wallet\n");
        let wallets = await walletServer.wallets();
        let wallet = await walletServer.getShelleyWallet(wallets[index].id);
        let data = {
            wallet_index: index, 
            id: 0,
            Name: 0,
            balance: 0,
            delegation_status: 0
        };
        data.id = wallet.id;
        data.Name = wallet.name;
        data.balance = wallet.getAvailableBalance();
        data.delegation_status = wallet.delegation.active.status;

        console.log(data);

        return data;
    },
    getWallets: async function () {
        console.log("Get wallets\n");
        let wallets = await walletServer.wallets();
        let result = [];
        for (let i = 0;i < wallets.length;i++)
        {
            let data = {
                index: 0,
                id: 0,
                Name: 0,
                balance: 0,
                delegation_status: 0
            };
            console.log("Iteration\n");
            data.index = i;
            data.id = wallets[i].id;
            data.Name = wallets[i].name;
            data.balance = wallets[i].getAvailableBalance();
            data.delegation_status = wallets[i].delegation.active.status;
            result.push(data);
        }

        return result;
    },
    clearWalletServer: async function () {
        let wallets = await walletServer.wallets();
        for (let i = 0;i < wallets.length;i++)
        {
            await wallets[i].delete();
        }
    },
    deleteWallet: async function (index) {
        let wallets = await walletServer.wallets();
        wallets[index].delete();
    }
};

module.exports = cardanoDemo;