import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Token from "./artifacts/contracts/Token.sol/Token.json";
import DanToken from "./artifacts/contracts/DanToken.sol/DanToken.json";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import WelcomeBackground from "./resources/vid1.mp4";
import SearchBack from "./resources/vid3.mp4";
import VendorBack from "./resources/vid4.mp4";
import AboutBack from "./resources/vid2.mp4";
import DanFaucetBack from "./resources/vid7.mp4";
import DatePicker from "react-datepicker";

const ethTokenAddress = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";
const danTokenAddress = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d";
const danWalletAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

function App() {
  const [userAccount, setUserAccount] = useState();
  const [ethBalance, setEthBalance] = useState();
  const [danBalance, setDanBalance] = useState();
  const [displayedUserAccount, setDisplayedUserAccount] = useState();
  const faucetAmount = 100;

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
      const contract = new ethers.Contract(
        ethTokenAddress,
        Token.abi,
        provider
      );

      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
      setEthBalance(balance);
      setUserAccount(account);
    }
  }

  async function getDanBalance() {
    if (typeof window.ethereum !== "undefined") {
      let account = getActiveAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        danTokenAddress,
        DanToken.abi,
        provider
      );
      const danBalance = await contract.balanceOf(account);
      console.log("DAN Balance: ", danBalance.toString());
      setDanBalance(danBalance);
      setUserAccount(account);
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ethTokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, faucetAmount);
      await transaction.wait();
      console.log(`${faucetAmount} Coins successfully sent to ${userAccount}`);
    }
  }

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
      contract.faucet(account, 100);
      console.log(
        `1: ${faucetAmount} Coins successfully sent to ${userAccount}`
      );
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
              <Home />
            </Route>
            <Route path="/AccountInfo">
              <AccountInfo />
            </Route>
            <Route path="/vendor">
              <Vendor />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/DanTokens">
              <DanTokens />
            </Route>
          </Switch>
          <HeaderLinks />
        </div>
      </div>
    </Router>
  );

  function HeaderLinks() {
    return (
      <div class="headerLinks">
        <div class="no-bullets overlay headLinks headerLinks">
          <span>
            <Link to="/">Home</Link>
          </span>
          <span>
            <Link to="/AccountInfo">Account Info</Link>
          </span>
          <span>
            <Link to="/vendor">Add Event</Link>
          </span>
          <span>
            <Link to="/about">About</Link>
          </span>
          <span>
            <Link to="/DanTokens">Dan Token Faucet</Link>
          </span>
        </div>

        <hr />
      </div>
    );
  }

  function Home() {
    const [startDate, setStartDate] = useState(new Date());
    return (
      <div>
        <video id="vid" className="background videoTag" autoPlay loop muted>
          <source src={WelcomeBackground} type="video/mp4" />
        </video>
        <div class="overlay WelcomeMsg">
          <h2>
            Welcome To TicketBlock. <br />
            Giving the power of tickets back to the people <br />
            Through the power of BlockChain
          </h2>

          <form>
            <input
              type="text"
              class="city"
              name="city"
              placeholder="City or Zip"
            />
            {/* <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            /> */}
            <input
              type="text"
              class="searchTerm"
              name="searchTerm"
              placeholder="Search for artist, venues, and events"
            />
            <input class="submit" type="submit" value="Search" />
            <br />
            <input type="reset" class="submit" defaultValue="Clear" />
          </form>
        </div>
      </div>
    );
  }

  function AccountInfo() {
    return (
      <div>
        <video className="background videoTag" autoPlay loop muted>
          <source src={SearchBack} type="video/mp4" />
        </video>
        <div class="overlay WelcomeMsg">
          <h2>Account Information</h2>
          <input
            id="sendTokenAddress"
            type="text"
            class="accountNumber"
            name="accountNumber"
            placeholder="Please enter your account number..."
            onChange={(e) => setUserAccount(e.target.value)}
            value={userAccount}
          />
          <button onClick={accountInfoSearch}>Search</button>
          <br />
        </div>
        <div class="danFaucetInfoTable">
          <br />
          <label id="acctNumLabel">Display Account:</label>
          <input
            class="genInput"
            disabled
            size="40"
            value={displayedUserAccount}
            onChange={(e) => {
              this.value = displayedUserAccount;
              this.accountInfoSearch();
            }}
            placeholder="Account ID"
          />{" "}
          <br />
          <label id="currBalance">ETH Balance:</label>
          <input
            class="genInput"
            disabled
            value={ethBalance}
            onChange={(e) => {
              this.setEthBalance(e.target.value);
              this.value = ethBalance;
            }}
            placeholder="Current ETH Balance"
          />
          <br />
          <label id="currBalance">DAN Balance:</label>
          <input
            class="genInput"
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
        <video className="background videoTag" autoPlay loop muted>
          <source src={VendorBack} type="video/mp4" />
        </video>
        <div class="overlay WelcomeMsg">
          <h2>Vendor</h2>
        </div>
      </div>
    );
  }

  function About() {
    return (
      <div>
        <video className="background videoTag" autoPlay loop muted>
          <source src={AboutBack} type="video/mp4" />
        </video>
        <div class="overlay WelcomeMsg">
          <h2>About</h2>
        </div>
      </div>
    );
  }

  function DanTokens() {
    return (
      <div>
        <video className="background videoTag" autoPlay loop muted>
          <source src={DanFaucetBack} type="video/mp4" />
        </video>
        {/* <form> */}
        <div class="overlay WelcomeMsg">
          <h2>Dan Token Faucet</h2>
          <input
            id="sendTokenAddress"
            type="text"
            class="accountNumber"
            name="accountNumber"
            placeholder="Please enter your account number..."
            onChange={(e) => setUserAccount(e.target.value)}
            value={userAccount}
          />
          <button onClick={danTokenFaucet}>Send Me Dan!</button>
          <br />
        </div>
        <div class="danFaucetInfoTable">
          <br />
          <label id="acctNumLabel">Account #:</label>
          <input
            class="genInput"
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
            class="genInput"
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
            class="genInput"
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
