## Getting started

Here's how to deploy this project

1. Clone the repo

```sh
git clone https://github.com/dabit3/full-stack-ethereum.git
```

2. Install the dependencies

```sh
npm install

# or

yarn
```

3. Start the local test node

```sh
npx hardhat node
```

4. Deploy the contract

```sh
npx hardhat run scripts/deploy.js --network localhost
```

5. Update **src/App.js** with the values of your contract addresses (`greeterAddress` and `tokenAddress`)

6. Run the app

```sh
npm start
```
