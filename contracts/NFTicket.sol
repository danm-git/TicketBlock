//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct Event {
  string  eventName;
  string  venueName;
  string  eventDescription;
  int numberOfTickets;
  string  eventDate;
}

contract NFTicket is ERC721, Ownable {

    Event[] public events;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("NFTicket", "BTIX") { }

    function mintNFT(string memory eventName,
                      string memory venueName,
                      string memory eventDescription, 
                      int numberOfTickets, 
                      string memory eventDate,
                      address recipient)
        public onlyOwner
        returns (uint256)
    {
        Event memory newEvent = Event(eventName, venueName, eventDescription, numberOfTickets, eventDate);
        events.push(newEvent);

        _tokenIds.increment();
    
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        tokenURI(newItemId);

        return newItemId;
    }
}
