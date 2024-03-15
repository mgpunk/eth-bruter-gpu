const fs = require("fs");
const { ethers } = require("ethers");

let tries = 0, hits = 0;
const maxTries = 2000000; // Maximale Anzahl von Versuchen
const delay = time => new Promise(res => setTimeout(res, time));
const words = fs.readFileSync("bip39.txt", { encoding: 'utf8', flag: 'r' }).replace(/(\r)/gm, "").toLowerCase().split("\n");
const usedMnemonics = new Set();

function gen12(words) {
    const n = 24;
    const shuffled = words.slice(); // Create a copy of the array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled.slice(0, n).join(" ");
}

console.log("starting....");

async function doCheck() {
    tries++;
    if (tries >= maxTries) {
        console.log(`\nReached maximum tries (${maxTries}), restarting...`);
        tries = 0;
        hits = 0;
        usedMnemonics.clear(); // Clearing used mnemonics
    }

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
