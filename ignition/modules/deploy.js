const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DAODeployment", (m) => {
  // Deploy Governance Token
  const governanceToken = m.contract("GovernanceToken");

  // Deploy TimeLock with constructor parameters
  const minDelay = 3600; // 1 hour in seconds
  const proposers = [];
  const executors = [];
  const admin = "0xe8239aFA5Cc7Ec80d27713A60D2E50facbeA3BC0";

  console.log("Deploying TimeLock with parameters:", minDelay, proposers, executors, admin);

  const timelock = m.contract("TimeLock", [
    minDelay,
    proposers,
    executors,
    admin
  ]);

  // Deploy Governor Contract
  const governor = m.contract("GovernorContract", [
    governanceToken,
    timelock,
    4, // quorumPercentage
    50400, // votingPeriod
    1 // votingDelay
  ]);

  // Deploy Box contract
  const box = m.contract("Box");

  // Set up roles for TimeLock
  const proposerRole = m.staticCall(timelock, "PROPOSER_ROLE");
  const executorRole = m.staticCall(timelock, "EXECUTOR_ROLE");
  const adminRole = m.staticCall(timelock, "TIMELOCK_ADMIN_ROLE");

  const grantProposerRole = m.call(
    timelock,
    "grantRole",
    [proposerRole, governor],
    { id: "grant_proposer_role" }
  );

  const grantExecutorRole = m.call(
    timelock,
    "grantRole",
    [executorRole, "0x0000000000000000000000000000000000000000"],
    { id: "grant_executor_role" }
  );

  const transferOwnership = m.call(
    box,
    "transferOwnership",
    [timelock],
    { id: "transfer_box_ownership" }
  );

  const revokeAdminRole = m.call(
    timelock,
    "revokeRole",
    [adminRole, admin],
    { id: "revoke_admin_role" }
  );

  // Return all the contract instances and transactions
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