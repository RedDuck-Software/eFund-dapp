# eFund

## How to run

1. Install Metamask extension
2. For local development add Hardhat network to metamask. [How?](https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC)
  (ChainId is ```31337```, RpcUrl is ```http://localhost:8545```)
3. Clone and setup [eFund-smart-contracts](https://github.com/RedDuck-Software/efund) repo
4. Compile and deploy smart contracts (check this [readme](https://github.com/RedDuck-Software/efund/blob/master/README.md))
5. Replace ```FUND_PLATFROM_ADDRESS_LOCALDEV``` and ```EFUND_TOKEN_LOCALDEV ``` constants in ```constants.ts``` file with newly deployed contract addresses
6. Install all client dependencies with ```npm i```
7. Run client with ```npm run serve```


## Requirements
- node.js version >= 14
- python

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
