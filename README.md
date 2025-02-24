# Decentralized Autonomous Organization (DAO) Implementation

## Project Overview

This project demonstrates a DAO governance system where token holders can propose, vote, and execute changes to a smart contract. The system includes:

* **GovernanceToken**: ERC-20 token used for voting power
* **TimeLock**: A time-lock mechanism to delay proposal execution
* **GovernorContract**: Handles proposal creation, voting, and execution
* **Box**: A sample contract to demonstrate governance functionality
* **Tally Integration**: User-friendly frontend interface for DAO governance

## Features

* **Token-Based Voting**: Voting power is proportional to GovernanceToken holdings
* **Time-Lock Mechanism**: Ensures proposals are executed after a delay
* **Proposal Lifecycle**: Supports proposal creation, voting, queuing, and execution
* **Hardhat Integration**: Includes tests and scripts for deployment and verification
* **Tally Dashboard**: Complete frontend interface for DAO management

## Technologies Used

* **Solidity**: Smart contract development
* **Hardhat**: Development environment for Ethereum-based projects
* **Polygon Amoy Testnet**: Deployment and testing network
* **Alchemy**: Node provider for interacting with the blockchain
* **Etherscan (Polygonscan)**: Contract verification and exploration
* **Tally**: Frontend interface for DAO governance

## Contract Addresses (Polygon Amoy Testnet)

| Contract | Address |
|----------|---------|
| Box | `0x4e26D96832D714bB1Dfb43e3143cDDC994C02495` |
| Governance Token | `0x59C0a29840cD7a2c9Acf4DC0a3EA4e92DC460803` |
| TimeLock | `0x946bEc1B29a1cE1C033af43b3c538506660BD822` |
| Governor Contract | `0x30333A70F7F110874b50c149e09f8721A7F22637` |

## Setup Instructions

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (v18 or higher)
2. Install [Hardhat](https://hardhat.org/):
   ```bash
   npm install --save-dev hardhat
   ```
3. Install dependencies:
   ```bash
   npm install @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-verify dotenv
   ```

### Configuration

1. Create a `.env` file in the root directory:
   ```plaintext
   PRIVATE_KEY=your_private_key_here
   RPC_URL=https://polygon-amoy.g.alchemy.com/v2/pStnSzocaCdsw0JLuO5Io-5c6xxakD_2
   Amoy_API_KEY=your_polygonscan_api_key_here
   ```

2. Network Configuration (`hardhat.config.js`):
   ```javascript
   module.exports = {
     solidity: "0.8.20",
     networks: {
       amoy: {
         url: process.env.RPC_URL,
         accounts: [process.env.PRIVATE_KEY],
         chainId: 80002
       },
     },
     etherscan: {
       apiKey: {
         amoy: process.env.Amoy_API_KEY
       }
     },
   };
   ```

## Deployment Process

### 1. Governance Token

* ERC20 token that governs the DAO
* Initial supply: 1,000,000 tokens
* Automatically minted to deployer's wallet

### 2. TimeLock

Configuration parameters:
* Minimum delay: 3600 seconds (1 hour)
* Initial proposers: Empty array
* Initial executors: Empty array
* Admin: Deployer address

### 3. Governor Contract

Configuration parameters:
* Token: Governance Token address
* TimeLock: TimeLock contract address
* Quorum: 4%
* Voting Period: 50400 blocks (~1 week)
* Voting Delay: 1 block

### 4. Box Contract

* Example contract controlled by the DAO
* Ownership transferred to TimeLock contract after deployment

## Proposal Workflow

### Creating a Proposal

```solidity
// Example proposal parameters
targets: [Box_contract_address]
values: [0]
calldatas: ["0x6057361d000000000000000000000000000000000000000000000000000000000000004d"]
```

### Voting Process

1. **Delegate Voting Power**
   * Users must delegate their voting power before voting
   * Can delegate to self or others
   * Must hold tokens before proposal creation

2. **Casting Votes**
   * Options: For (1), Against (0), Abstain (2)
   * Use `castVote` function with proposal ID

3. **Proposal States**
   * Check status using `state(proposalId)`
   * Monitor votes using `getVotes`

### Execution Process

1. **Queue Proposal** (after successful vote)
   ```solidity
   queue(
       [Box_contract_address],
       [0],
       ["0x6057361d000000000000000000000000000000000000000000000000000000000000004d"],
       keccak256(bytes("Store 77 in Box"))
   )
   ```

2. **Wait for TimeLock Delay**

3. **Execute Proposal**
   ```solidity
   execute(
       [Box_contract_address],
       [0],
       ["0x6057361d000000000000000000000000000000000000000000000000000000000000004d"],
       keccak256(bytes("Store 77 in Box"))
   )
   ```

## Testing

The project includes a comprehensive test suite covering:

* Contract deployment
* Proposal creation
* Voting mechanics
* Proposal execution
* TimeLock functionality

Run tests using:
```bash
npx hardhat test
```

## Frontend Integration with Tally

The DAO is integrated with Tally, providing a user-friendly interface for governance actions.

### Using Tally Interface

1. **Access Dashboard**
   * Visit [Tally](https://www.tally.xyz)
   * Connect your wallet
   * Search for the DAO using the Governor Contract address

2. **Key Features**
   * Create and vote on proposals through an intuitive interface
   * Track proposal status and voting results in real-time
   * Manage token delegation
   * View governance analytics and participation metrics

## Security Considerations

* Ensure proper role configuration in TimeLock
* Verify token holdings before proposal creation
* Consider timelock delays for security
* Test all proposals thoroughly before mainnet deployment

## License

MIT

## Contributing

Contributions are welcome! Please submit pull requests with improvements or bug fixes.