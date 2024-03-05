async function doCheck() {
    tries++;
    try {
        var mnemonic;
        do {
            mnemonic = gen12(words);
        } while (usedMnemonics.has(mnemonic));
        
        usedMnemonics.add(mnemonic);

        var wallet = ethers.Wallet.fromMnemonic(mnemonic);
        fs.appendFileSync('hits.txt', wallet.address + "," + wallet.privateKey + "\n");
        hits++;
        process.stdout.write("+");
    } catch (e) { }
    await delay(0); // Prevent Call Stack Overflow
    process.stdout.write("-");
    doCheck();
}
