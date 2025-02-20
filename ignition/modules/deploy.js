const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

function log(message) {
  console.log(`[DAO Deployment] ${message}`);
}

module.exports = buildModule("DAODeployment", (m) => {
  log("Starting deployment sequence...");

  // Deploy Governance Token first
  log("Deploying GovernanceToken...");
  const governanceToken = m.contract("GovernanceToken");
  log("GovernanceToken deployment initialized");

  // Deploy TimeLock with constructor parameters
  log("Deploying TimeLock...");
  const minDelay = 3600; // 1 hour in seconds
  const proposers = [];  // Empty array for now
  const executors = [];  // Empty array for now
  
  // Important: Set the deployer as admin initially
  // We'll use the first account from hardhat network
  const admin = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"; // Hardhat's first account

  const timelock = m.contract("TimeLock", [
    minDelay,
    proposers,
    executors,
    admin
  ]);
  log("TimeLock deployment initialized");

  // Deploy Governor Contract
  log("Deploying GovernorContract...");
  const quorumPercentage = 4; // 4%
  const votingPeriod = 50400; // About 1 week with 12s block time
  const votingDelay = 1; // 1 block

  const governor = m.contract("GovernorContract", [
    governanceToken, // token
    timelock,       // timelock
    quorumPercentage,
    votingPeriod,
    votingDelay
  ]);
  log("GovernorContract deployment initialized");

  // Deploy Box contract
  log("Deploying Box contract...");
  const box = m.contract("Box");
  log("Box deployment initialized");

  // Set up roles for TimeLock
  log("Setting up TimeLock roles...");

  // PROPOSER_ROLE should be given to Governor
  log("Granting PROPOSER_ROLE to Governor...");
  const grantProposerRole = m.call(
    timelock,
    "grantRole",
    [
      m.staticCall(timelock, "PROPOSER_ROLE"),
      governor
    ],
    { id: "grant_proposer_role" }
  );

  // EXECUTOR_ROLE can be given to zero address to let anyone execute
  log("Granting EXECUTOR_ROLE...");
  const grantExecutorRole = m.call(
    timelock,
    "grantRole",
    [
      m.staticCall(timelock, "EXECUTOR_ROLE"),
      "0x0000000000000000000000000000000000000000"
    ],
    { id: "grant_executor_role" }
  );

  // Transfer Box ownership to TimeLock
  log("Transferring Box ownership to TimeLock...");
  const transferOwnership = m.call(
    box,
    "transferOwnership",
    [timelock],
    { id: "transfer_box_ownership" }
  );

  // Revoke admin role from deployer - do this last
  log("Revoking admin role...");
  const revokeAdminRole = m.call(
    timelock,
    "revokeRole",
    [
      m.staticCall(timelock, "TIMELOCK_ADMIN_ROLE"),
      admin
    ],
    { id: "revoke_admin_role" }
  );

  log("All deployments and setups initialized");

  return {
    governanceToken,
    timelock,
    governor,
    box,
    grantProposerRole,
    grantExecutorRole,
    transferOwnership,
    revokeAdminRole
  };
});