import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import WelcomeBackground from "./resources/vid1.mp4";
import SearchBack from "./resources/vid3.mp4";
import VendorBack from "./resources/vid2.mp4";
import DatePicker from "react-datepicker";

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function App() {
  const [greeting, setGreetingValue] = useState();
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
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

          <form>
            <input
              type="text"
              class="accountNumber"
              name="accountNumber"
              placeholder="Please enter your account number..."
            />
            <input class="submit" type="submit" value="Search" />
            <br />
            <input type="reset" class="submit" defaultValue="Clear" />
          </form>
        </div>
      </div>
    );
  }

  function Vendor() {
    return (
      <div>
        <video className="videoTag" autoPlay loop muted>
          <source src={VendorBack} type="video/mp4" />
        </video>
        <h2>Vendor</h2>
      </div>
    );
  }

  function About() {
    return (
      <div>
        <h2>About</h2>
        <header className="App-header">
          <button onClick={fetchGreeting}>Fetch Greeting</button>
          <button onClick={setGreeting}>Set Greeting</button>
          <input
            onChange={(e) => setGreetingValue(e.target.value)}
            placeholder="Set greeting"
          />

          <br />
          <button onClick={getBalance}>Get Balance</button>
          <button onClick={sendCoins}>Send Coins</button>
          <input
            onChange={(e) => setUserAccount(e.target.value)}
            placeholder="Account ID"
          />
          <input
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
        </header>
      </div>
    );
  }
}
export default App;
