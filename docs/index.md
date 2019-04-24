---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: default
---


## Requirements
To make the set up easier, the environment of the project is dockerized, so the main requirements are:
- Docker
- Docker-compose

## Workshop Setup
- First of all, we need to clone the Github project to our machine with:<br/>
```git clone https://github.com/aave/split-croatia-workshop.git```

- Once downloaded, we go to the project folder and start the docker-compose services:<br/>
```cd split-croatia-workshop```<br/>
```docker-compose up --build```

- After the previous step, that installs all the dependencies of the project, we will have 2 services running in our docker-compose stack:
    - The truffle environment to compile, deploy and interact with the smart contracts (**smart-contracts**).
    - A Ganache Ethereum network used as development network for the truffle environment (**ganache**).

- Leaving the current console window open, we need to open another one to "enter" inside the **smart-contracts** docker service environment, being able to execute all the available npm and truffle commands:<br/>
```docker-compose exec smart-contracts bash```

## Workshop levels

### 1º Level. Explanation of our simplified Lending Pool.
The important scripts used here (and always from the console inside the docker **smart-contracts** service) are:
- To simply compile the smart contracts:<br/>
```truffle compile```
- To clean the truffle environment, compile and deploy the current smart contracts in the ganache network:<br/>
```npm run ganache:cleanAndDeploy```

### 2º Level. Implement the remaining methods on the LendingPool smart contract
Time to work a little! And for that, the important scripts are the ones from the previous steps plus:
- To execute the tests implemented on **test/LendingPool.spec.js** (and other test files located on the test/ folder):<br/>
```npm run ganache:test```

### 3º Level. Reveal and explain full implementation of the LendingPool.
No new scripts here.

### 4º Level. Deployment on kovan and interaction with a sample client.


## Useful links
- Docker install docs: [https://docs.docker.com/install/](https://docs.docker.com/install/)
- Docker-compose install docs: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)
- Truffle docs: [https://truffleframework.com/docs/truffle/overview](https://truffleframework.com/docs/truffle/overview)
