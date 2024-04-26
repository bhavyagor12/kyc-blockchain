//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import {KYCVerificationStructs} from "./DataModel.sol";
contract KYCVerification {
    event ContractInitialized();
    event CustomerKYCRequestAdded();
    event CustomerKYCRequestRemoved();
    event CustomerKYCRequestApproved();
    event NewCustomerCreated(address customerAddress);
    event CustomerRemoved();
    event CustomerInfoModified();
    event NewBankCreated();
    event BankRemoved();
    event BankBlockedFromKYC();

    address immutable admin;
    address[] public bankAddressess; //to keep list of bank addresses, so that we can loop through when required;
    address[] public customerAddresses; // to keep a list of all customers unique ids so that we can loop through when required

    mapping(address => KYCVerificationStructs.Customer) public customersInformation; //mapping a customers's uniqueId to CUstomer Struct
    mapping(address => KYCVerificationStructs.Bank) public banks; //  Mapping a bank's address to the Bank
    mapping(uint256 => KYCVerificationStructs.Bank) public banksRegistrationNumberMapping; //mapping a bank's registration number to the Bankh
    mapping(uint256 => KYCVerificationStructs.KYCRequest) public kycRequests; //mapping a customers id to KYC Request

    mapping(address => mapping(int256 => uint256)) bankActionsAudit; //to track each bank and their actions with time stamp
    modifier onlyAdmin() {
     require(msg.sender == admin, "Only admin can call this function");
     _;
    }

    modifier onlyBank() {
     require(banks[msg.sender].ethAddress == msg.sender, "Only bank can call this function");
     _;
    }

   constructor() {
     emit ContractInitialized();
     admin = msg.sender;
   }
   
   function addCustomer (string memory name, string memory age, string memory phoneNumber, string memory aadharIPFS, string memory panIPFS, string memory photoIPFS) public {
     require(customersInformation[msg.sender].customerAddress != msg.sender, "Customer already exists");
     KYCVerificationStructs.Customer memory newCustomer = KYCVerificationStructs.Customer(msg.sender, name, age, phoneNumber, aadharIPFS, panIPFS, photoIPFS, KYCVerificationStructs.KycStatus.Pending);
     customersInformation[msg.sender] = newCustomer;
     customerAddresses.push(msg.sender);
     emit NewCustomerCreated(msg.sender); 
   }

   function updateCustomer (string memory name, string memory age, string memory phoneNumber, string memory aadharIPFS, string memory panIPFS, string memory photoIPFS) public {
     require(customersInformation[msg.sender].customerAddress == msg.sender, "Customer does not exist");
     KYCVerificationStructs.Customer memory updatedCustomer = KYCVerificationStructs.Customer(msg.sender, name, age, phoneNumber, aadharIPFS, panIPFS, photoIPFS, KYCVerificationStructs.KycStatus.Pending);
     customersInformation[msg.sender] = updatedCustomer;
     emit CustomerInfoModified();
   }

   function getRoleOfAddress(address userAddress) public view returns(string memory) {
     if (userAddress == admin) {
       return "Admin";
     } else if (banks[userAddress].ethAddress == userAddress) {
       return "Bank";
     } else if (customersInformation[userAddress].customerAddress == userAddress) {
       return "Customer";
     } else {
       return "User";
     }
   }

   function getCustomerInfo(address customerAddress) public view returns(KYCVerificationStructs.Customer memory) {
     return customersInformation[customerAddress];
   }

}
