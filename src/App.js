import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import DanToken from "./artifacts/contracts/DanToken.sol/DanToken.json";
import NFToken from "./artifacts/contracts/NFTicket.sol/NFTicket.json";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const danWalletAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";

const contractAddress = "0xAB41A0D8B85d88518C672a451032a69d95043aB8";
const danTokenAddress = "0x728d3748444c9e2Cc9a55a3eFAAd87f1c5C43295";
// const nftTokenAddress = "0x812b1747B7573f0429Fb49c3eceaE3f3A3b5AFe8";

function App() {
  const [userAccount, setUserAccount] = useState();
  const [ethBalance, setEthBalance] = useState();
  const [danBalance, setDanBalance] = useState();
  const [displayedUserAccount, setDisplayedUserAccount] = useState();
  const faucetAmount = 50;

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  function getActiveAccount() {
    let account = null;
    if (userAccount) {
      account = userAccount;
      console.log(`1: ${account}`);
    } else {
      account = danWalletAddress;
      console.log(`2: ${account}`);
    }

    return account;
  }

  async function getEthBalance() {
    if (typeof window.ethereum !== "undefined") {
      let account = getActiveAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      provider.getBalance(account).then((balance) => {
        // convert a currency unit from wei to ether
        const balanceInEth = ethers.utils.formatEther(balance);
        setEthBalance(balanceInEth);
        console.log("balanceInEth: ", balanceInEth.toString());
      });
    }
  }

  async function getDanBalance() {
    console.log("start Dan");

    if (typeof window.ethereum !== "undefined") {
      let account = getActiveAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        danTokenAddress,
        DanToken.abi,
        provider
      );
      console.log(" Dan balance...");

      const danBalance = await contract.balanceOf(account);

      const danBalanceInEth = ethers.utils.formatEther(danBalance);
      console.log(
        "DAN Balance: ",
        danBalance.toString() + "  - danBalanceInEth=" + danBalanceInEth
      );
      setDanBalance(danBalanceInEth);
    }
  }

  // async function sendCoins() {
  //   if (typeof window.ethereum !== "undefined") {
  //     await requestAccount();
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(ethTokenAddress, Token.abi, signer);
  //     const transaction = await contract.transfer(userAccount, faucetAmount);
  //     await transaction.wait();
  //     console.log(`${faucetAmount} Coins successfully sent to ${userAccount}`);
  //   }
  // }

  async function accountInfoSearch() {
    setDisplayedUserAccount(getActiveAccount());
    getDanBalance();
    getEthBalance();
  }

  async function danTokenFaucet() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        danTokenAddress,
        DanToken.abi,
        signer
      );

      let account = getActiveAccount();
      contract.faucet(account, faucetAmount);
      console.log(
        `1: ${faucetAmount} Coins successfully sent to ${userAccount}`
      );
    }
  }

  async function generateEventToken() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        NFToken.abi,
        signer
      );

      let account = getActiveAccount();
      console.log("Active Account:", account);
      var eventName = "My Event";
      var venueName = "My Venue";
      var eventDescription = "My Event Description";
      var numberOfTickets = 1000;
      var eventDate = "Event Date";

      try {
        var uniqueId = contract.mintNFT(
          eventName,
          venueName,
          eventDescription,
          numberOfTickets,
          eventDate,
          account
        );

        console.log("Minted an Event:", uniqueId + " For: " + account);
      } catch (error) {
        console.log("Error Minting Event:", error);
      }
    }
  }

  async function clearPage() {
    setUserAccount("");
    setEthBalance("");
    setDisplayedUserAccount("");
    setDanBalance("");
  }

  return (
    <Router>
      <div className="App overlay full">
        <div>
          <Switch>
            <Route exact path="/">
              <AccountInfo />
            </Route>
            <Route path="/AccountInfo">
              <AccountInfo />
            </Route>
            <Route path="/DanTokens">
              <DanTokens />
            </Route>
            <Route path="/vendor">
              <Vendor />
            </Route>
            <Route path="/about">
              <About />
            </Route>
          </Switch>
          <HeaderLinks />
        </div>
      </div>
    </Router>
  );

  function HeaderLinks() {
    return (
      <div className="headerLinks">
        <div className="no-bullets overlay headLinks headerLinks">
          {/* <span>
            <Link to="/">Home</Link>
          </span> */}
          <span>
            <Link to="/AccountInfo">Account Info</Link>
          </span>
          <span>
            <Link to="/DanTokens">Dan Token Faucet</Link>
          </span>
          <span>
            <Link to="/vendor">Add Event</Link>
          </span>
          <span>
            <Link to="/about">About</Link>
          </span>
        </div>

        <hr />
      </div>
    );
  }

  function Home() {
    // const [startDate, setStartDate] = useState(new Date());
    return (
      <div>
        <div class="home-bg"></div>
        <div className="overlay WelcomeMsg">
          <h2>
            Welcome To TicketBlock. <br />
            Giving the power of tickets back to the people <br />
            Through the power of BlockChain
          </h2>

          <form>
            <input
              type="text"
              className="city"
              name="city"
              placeholder="City or Zip"
            />
            {/* <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            /> */}
            <input
              type="text"
              className="searchTerm"
              name="searchTerm"
              placeholder="Search for artist, venues, and events"
            />
            <input className="submit" type="submit" value="Search" />
            <br />
            <input type="reset" className="submit" defaultValue="Clear" />
          </form>
        </div>
      </div>
    );
  }

  function AccountInfo() {
    return (
      <div>
        <div class="accountinfo-bg"></div>
        <div className="danFaucetInfoTable">
          <h2>Account Information</h2>
          <input
            id="sendTokenAddress"
            type="text"
            className="accountNumber b-border"
            name="accountNumber"
            placeholder="Please enter your account number..."
            onChange={(e) => setUserAccount(e.target.value)}
            value={userAccount}
          />
          <br />
          <button onClick={accountInfoSearch}>Search</button>
          <br />
          <br />
          <label id="acctNumLabel" class="minPad">
            Display Account:
          </label>
          <input
            className="genInput b-border"
            disabled
            size="40"
            value={displayedUserAccount}
            onChange={(e) => {
              this.value = displayedUserAccount;
              accountInfoSearch();
            }}
            placeholder="Account ID"
          />{" "}
          <br />
          <label id="currBalance" class="morePad">
            ETH Balance:
          </label>
          <input
            className="genInput b-border"
            disabled
            value={ethBalance}
            onChange={(e) => {
              this.setEthBalance(e.target.value);
              this.value = ethBalance;
            }}
            placeholder="Current ETH Balance"
          />
          <br />
          <label id="currBalance" class="morePad">
            DAN Balance:
          </label>
          <input
            className="genInput b-border"
            disabled
            value={danBalance}
            onChange={(e) => {
              this.setDanBalance(e.target.value);
              this.value = danBalance;
            }}
            placeholder="Current Dan Balance"
          />
          <br />
          <br />
          <button onClick={clearPage}>Clear Page</button>
        </div>
      </div>
    );
  }

  function Vendor() {
    return (
      <div>
        <div class="vendor-bg"></div>
        <div className="overlay WelcomeMsg">
          <h2>Vendor</h2>
          <input
            id="mintNewToken"
            type="text"
            className="mintNewToken"
            name="mintNewToken"
            placeholder="Please enter your account number..."
            onChange={(e) => setUserAccount(e.target.value)}
            value={userAccount}
          />
          {/* <button onClick={accountInfoSearch}>Search</button> */}
          <br />

          <button onClick={generateEventToken}>Generate new event!</button>
        </div>
      </div>
    );
  }

  function About() {
    return (
      <div>
        <video className="background videoTag" autoPlay loop muted>
          <source
            src="https://resource-web.s3.us-east-2.amazonaws.com/vid2.mp4"
            type="video/mp4"
          />
        </video>
        <div className="overlay WelcomeMsg">
          <h2>About</h2>
        </div>
      </div>
    );
  }

  function DanTokens() {
    return (
      <div>
        <div class="dantok-bg"></div>
        {/* <form> */}
        <div className="overlay WelcomeMsg">
          <h2>Dan Token Faucet</h2>
          <input
            id="sendTokenAddress"
            type="text"
            className="accountNumber"
            name="accountNumber"
            placeholder="Please enter your account number..."
            onChange={(e) => setUserAccount(e.target.value)}
            value={userAccount}
          />
          <button onClick={accountInfoSearch}>Check Balances</button>
          <button onClick={danTokenFaucet}>Send Me Dan!</button>
          <br />
        </div>
        <div className="danFaucetInfoTable">
          <br />
          <label id="acctNumLabel">Account #:</label>
          <input
            className="genInput"
            disabled
            size="40"
            value={userAccount}
            onChange={(e) => {
              this.setuserAccount(e.target.value);
              this.value = userAccount;
            }}
            placeholder="Account ID"
          />{" "}
          <br />
          <label id="currBalance">ETH Balance:</label>
          <input
            className="genInput"
            disabled
            value={ethBalance}
            onChange={(e) => {
              this.setEthBalance(e.target.value);
              this.value = ethBalance;
            }}
            placeholder="Current ETH Balance"
          />
          <button onClick={getEthBalance}>Get ETH Balance</button>
          <br />
          <label id="currBalance">DAN Balance:</label>
          <input
            className="genInput"
            disabled
            value={danBalance}
            onChange={(e) => {
              this.setDanBalance(e.target.value);
              this.value = danBalance;
            }}
            placeholder="Current Dan Balance"
          />
          <button onClick={getDanBalance}>Get Dan Balance</button>
          <br />
          <br />
          <button onClick={clearPage}>Clear Page</button>
        </div>
        {/* </form> */}
      </div>
    );
  }
}
export default App;
