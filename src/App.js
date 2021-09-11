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
const privateKey =
  "20aaf9f5b3b4e74ad06fd05fbb3dedeab0b9f7f77741c978ec383d5f65137365";

function App() {
  const [userAccount, setUserAccount] = useState();
  const [ethBalance, setEthBalance] = useState();
  const [danBalance, setDanBalance] = useState();
  const [displayedUserAccount, setDisplayedUserAccount] = useState();
  const [sendAmount, setSendAmount] = useState();
  const [receiverAddress, setReceiverAddress] = useState();
  // const [senderAddress, setSenderAddress] = useState();
  // const [accounts, setAccounts] = useState();

  const faucetAmount = 50;
  var listId = 0;

  async function requestAccount() {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    //setAccounts(accounts);
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

  async function transferEth() {
    if (typeof window.ethereum !== "undefined") {
      var amountInEther = "0.1";
      // var sender = "0xAB41A0D8B85d88518C672a451032a69d95043aB8";
      // var receiver = "0xfCA8c05f5A09b1094E8885a79E80B618E0e8536b";
      // var amount = ethers.utils.parseEther("0.1");

      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let wallet = new ethers.Wallet(privateKey, provider);

      let tx = {
        to: receiverAddress,
        // Convert currency unit from ether to wei
        value: ethers.utils.parseEther(amountInEther),
      };

      wallet.sendTransaction(tx).then((txObj) => {
        console.log("txHash", txObj.hash);
        alert(`${amountInEther} Coins successfully sent to ${receiverAddress}`);
      });

      // const signer = provider.getSigner();
      // const contract = new ethers.Contract(contractAddress, Token.abi, signer);
      // const transaction = await contract.transfer(receiverAddress, amount);
      // await transaction.wait();
      console.log(
        `${amountInEther} Coins successfully sent to ${receiverAddress}`
      );
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
    setSendAmount("");
    setReceiverAddress("");
    // setSenderAddress("");
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
            <Route path="/TransferTokens">
              <TransferTokens />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route
              path="/algo"
              component={() => {
                var a = document.createElement("a");
                a.href = "https://algo.blockc.xyz/";
                a.setAttribute("target", "_blank");
                a.click();
                return null;
              }}
            />
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
            <Link to="/algo">Algorand Sandbox</Link>
          </span>
          <span>
            <Link to="/TransferTokens">Transfer Tokens</Link>
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

  /*function Home() {
    // const [startDate, setStartDate] = useState(new Date());
    return (
      <div>
        <div className="home-bg"></div>
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
  }*/

  function AccountInfo() {
    return (
      <div>
        <div className="accountinfo-bg"></div>
        <div className="accountInfoTable">
          <h2>Account Information (Ropsten)</h2>
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
          <label id="acctNumLabel" className="minPad">
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
          <label id="currBalance" className="morePad">
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
          <label id="currBalance" className="morePad">
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

  function TransferTokens() {
    return (
      <div>
        <div className="transfertoken-bg"></div>
        <div className="accountInfoTable">
          <h2>ETH Transfer (Ropsten)</h2>
          <div className="fromSection">
            <h3 className="sectionTitle">TO ADDRESS</h3>
            {/* <p>Ensure you are logged into the Meta Mask sender wallet.</p> */}
            <div className="fromAcctNum">
              <br />
              <label id="acctNumLabel" className="minPad">
                Account:
              </label>
              <input
                id="sendTokenAddress"
                type="text"
                className="accountNumber b-border"
                name="accountNumber"
                placeholder="Please enter the RECEIVER address..."
                onChange={(e) => setReceiverAddress(e.target.value)}
                value={receiverAddress}
              />
            </div>
            <div className="fromAcctNum">
              <label id="amountLabel" className="amountLabel">
                Amount:
              </label>
              <input
                id="amountToSend"
                type="number"
                // step="0.01"
                maxLength="8"
                className="amountToSend b-border"
                name="amount"
                placeholder=".1"
                // onChange={(e) => setSendAmount(e.target.value)}
                value={sendAmount}
                disabled
              />
            </div>
          </div>
          <br />
          <button onClick={transferEth}>Send Now!</button>
          <button onClick={clearPage}>Clear Page</button>
        </div>
      </div>
    );
  }

  function Vendor() {
    return (
      <div>
        <div className="vendor-bg"></div>
        <div className="vendorTable">
          <h2>Vendor (UC)</h2>
          <p className="explainText">
            This will generate a new NFTicket Token. This is the beginning of a
            Smart ticketing option.{" "}
          </p>
          <input
            id="mintNewToken"
            type="text"
            className="mintNewToken b-border"
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
    const projects = [
      {
        proj: "(New) Algorand Sandbox - Learning Algorand!",
        link: "/algo",
      },
      {
        proj: "DAN Token and faucet (Ropsten)",
        link: "/DanTokens",
      },
      {
        proj: "Account Lookup Page - DAN, ETH (Ropsten)",
        link: "/AccountInfo",
      },
      {
        proj: "Transfer ETH between my accounts (Ropsten)",
        link: "/TransferTokens",
      },
      { proj: "Solana/Rust Project (UC)", link: "/About" },
      { proj: "GoLang Web3 Project (UC)", link: "/About" },
      {
        proj: "NFTicket - A Smart contract ticketing system (Ropsten) (UC)",
        link: "/vendor",
      },
      {
        proj:
          "ChainLink - Link Token balance check and creating an Oracle - Coming Soon...",
        link: "/About",
      },
      { proj: "Cardano Hello World - Coming Soon...", link: "/About" },
      { proj: "Polygon Hello World - Coming Soon...", link: "/About" },
      { proj: "Opensea DAO - Coming Soon...", link: "/About" },
      { proj: "NFTimeCapsule - Coming Soon...", link: "/About" },
      {
        proj:
          "A Lotto NFTicket, when purchased, would have the opportunity to win prizes/crypto.  Think Lotto Ticket meets Loot box. - Coming Soon...",
        link: "/About",
      },
    ];

    return (
      <div>
        <div className="about-bg"></div>
        <div className="aboutTable">
          <h2>About</h2>
          <div className="aboutDesc">
            This is my sandbox for learning blockchain. Below are some of the
            ideas/prototypes I am working on or hope to work on soon! NOTE: This
            is not production worthy code. Just a place to try out some ideas.
            Should be something new every days so please stop by and check it
            out. Any Questions or comments or just want to say hi? Send them to:
            daniel.e.munto@gmail.com!
          </div>
          <div className="aboutText">
            <ul className="aboutList">
              <span></span>

              {projects.map((project) => (
                <li key={listId++}>
                  <Link to={project.link}>{project.proj}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  function DanTokens() {
    return (
      <div>
        <div className="dantok-bg"></div>
        <div className="danFaucetInfoTable">
          {/* <div className="overlay WelcomeMsg"> */}
          <h2>Dan Token Faucet (Ropsten)</h2>
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
          <button onClick={accountInfoSearch}>Check Balances</button>
          <button onClick={danTokenFaucet}>Send Me Dan!</button>
          <br />
          {/* </div> */}
          <br />
          <label id="acctNumLabel">Account # (Entered above)</label>
          <br />
          <input
            className="genInput b-border"
            disabled
            size="40"
            value={userAccount}
            onChange={(e) => {
              this.setuserAccount(e.target.value);
              this.value = userAccount;
            }}
            placeholder="Enter Account Above"
          />{" "}
          <br />
          <br />
          <label className="balanceText" id="currBalance">
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
          <button onClick={getEthBalance}>Get ETH Balance</button>
          <br />
          <label className="balanceText" id="currBalance">
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
          <button onClick={getDanBalance}>Get Dan Balance</button>
          <br />
          <br />
          <button onClick={clearPage}>Clear Page</button>
        </div>
      </div>
    );
  }
}
export default App;
