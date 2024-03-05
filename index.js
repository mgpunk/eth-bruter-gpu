const fs = require("fs");
const { ethers } = require("ethers");

let tries = 0, hits = 0;
const delay = time => new Promise(res => setTimeout(res, time));
const words = fs.readFileSync("bip39.txt", { encoding: 'utf8', flag: 'r' }).replace(/(\r)/gm, "").toLowerCase().split("\n");
const usedMnemonics = new Set();

function gen12(words) {
    const n = 24;
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n).join(" ");
}

console.log("starting....");

async function doCheck() {
    tries++;
    try {
        let mnemonic;
        do {
            mnemonic = gen12(words);
        } while (usedMnemonics.has(mnemonic));
        
        usedMnemonics.add(mnemonic);

        const wallet = ethers.Wallet.fromMnemonic(mnemonic);
        fs.appendFileSync('hits.txt', wallet.address + "," + wallet.privateKey + "\n");
        hits++;
        process.stdout.write("+");
    } catch (e) { }
    await delay(0); // Prevent Call Stack Overflow
    process.stdout.write("-");
    doCheck();
}

doCheck();
