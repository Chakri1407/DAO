const hre = require("hardhat");

async function main() {
  const TIMELOCK_ADDRESS = "0x946bEc1B29a1cE1C033af43b3c538506660BD822";
  const MIN_DELAY = 3600;
  const PROPOSERS = [];
  const EXECUTORS = [];
  const ADMIN = "0xe8239aFA5Cc7Ec80d27713A60D2E50facbeA3BC0";

  console.log("Verifying TimeLock contract...");
  try {
    await hre.run("verify:verify", {
      address: TIMELOCK_ADDRESS,
      contract: "contracts/Governanace/TimeLock.sol:TimeLock",
      constructorArguments: [
        MIN_DELAY,
        PROPOSERS,
        EXECUTORS,
        ADMIN
      ],
    });
    console.log("Verification successful!");
  } catch (error) {
    console.error("Verification error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });