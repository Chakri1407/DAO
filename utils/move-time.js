const { network } = require("hardhat")

async function moveTime(amount) {
    console.log("Moving time...")
    await network.provider.send("evm_increaseTime", [amount])
}

module.exports = {
    moveTime,
} 