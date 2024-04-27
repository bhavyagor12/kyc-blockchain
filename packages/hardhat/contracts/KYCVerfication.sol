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
    address[] public bankAddresses; //to keep list of bank addresses, so that we can loop through when required;
    address[] public customerAddresses; // to keep a list of all customers unique ids so that we can loop through when required

    mapping(address => KYCVerificationStructs.Customer) public customersInformation; //mapping a customers's uniqueId to CUstomer Struct
    mapping(address => KYCVerificationStructs.Bank) public banks; //  Mapping a bank's address to the Bank
    mapping(uint256 => KYCVerificationStructs.Bank) public banksRegistrationNumberMapping; //mapping a bank's registration number to the Bankh
    mapping(address => KYCVerificationStructs.KYCRequest) public kycRequests;
    mapping(address => string[]) public bankAddressToKycRequests;
    //mapping a customers id to KYC Request
    mapping(address => mapping(int256 => uint256)) bankActionsAudit; //to track each bank and their actions with time stamp
    modifier onlyAdmin() {
     require(msg.sender == admin, "Only admin can call this function");
     _;
    }

    modifier onlyBank() {
     require(banks[msg.sender].bankAddress == msg.sender, "Only bank can call this function");
     _;
    }

   constructor() {
     emit ContractInitialized();
     admin = msg.sender;
     KYCVerificationStructs.Bank memory newBank = KYCVerificationStructs.Bank("adminBank", 0, 0xD1DE440D072b044496b497914C39CBDb6bDb3FaA, new address[](0));
     banks[0xD1DE440D072b044496b497914C39CBDb6bDb3FaA] = newBank;
     bankAddresses.push(0xD1DE440D072b044496b497914C39CBDb6bDb3FaA);
     KYCVerificationStructs.Customer memory newCustomer = KYCVerificationStructs.Customer(0xD1DE440D072b044496b497914C39CBDb6bDb3FaA, "Bhavya", "21", "9324216868", "bafkreiacp57nt4kwion7lvne326zrcg6zzaterb4r5j222oknilhrxyjoy", "bafkreiacp57nt4kwion7lvne326zrcg6zzaterb4r5j222oknilhrxyjoy", "bafkreiacp57nt4kwion7lvne326zrcg6zzaterb4r5j222oknilhrxyjoy", KYCVerificationStructs.KycStatus.Pending);
     customersInformation[0xD1DE440D072b044496b497914C39CBDb6bDb3FaA] = newCustomer;
    customerAddresses.push(0xD1DE440D072b044496b497914C39CBDb6bDb3FaA);
    emit NewCustomerCreated(0xD1DE440D072b044496b497914C39CBDb6bDb3FaA);
     emit NewBankCreated();
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

   function removeCustomer(address customerAddress) public onlyAdmin {
     require(customersInformation[customerAddress].customerAddress == customerAddress, "Customer does not exist");
     delete customersInformation[customerAddress];
     emit CustomerRemoved();
   }

   function addBank(string memory name, uint256 registrationNumber) public onlyAdmin {
     require(banks[msg.sender].bankAddress != msg.sender, "Bank already exists");
     KYCVerificationStructs.Bank memory newBank = KYCVerificationStructs.Bank(name, 0, msg.sender, new address[](0));
     banks[msg.sender] = newBank;
     banksRegistrationNumberMapping[registrationNumber] = newBank;
     bankAddresses.push(msg.sender);
     emit NewBankCreated();
   }
   
   function sendDocsForKyc(string memory _aadharHash, string memory _panHash, string memory _photoHash,address _bankAddress) public {
    require(customersInformation[msg.sender].customerAddress == msg.sender, "Customer does not exist");
    KYCVerificationStructs.Customer storage customer = customersInformation[msg.sender];
    require(customer.status != KYCVerificationStructs.KycStatus.Approved, "KYC Request already approved");
    string memory requestId = string(abi.encodePacked(block.timestamp, msg.sender));
    KYCVerificationStructs.KYCRequest memory newRequest = KYCVerificationStructs.KYCRequest(requestId,_aadharHash, _panHash, _photoHash,msg.sender);
    kycRequests[msg.sender] = newRequest;
    bankAddressToKycRequests[_bankAddress].push(newRequest.requestId);
    customer.status = KYCVerificationStructs.KycStatus.Pending;
    emit CustomerKYCRequestAdded();
}

function verifyKyc(address customerAddress,uint256 status) public onlyBank {
    require(customersInformation[customerAddress].customerAddress == customerAddress, "Customer does not exist");
    KYCVerificationStructs.Customer storage customer = customersInformation[customerAddress];
    require(customer.status == KYCVerificationStructs.KycStatus.Pending, "KYC Request not pending");
    if (status == 1) {
        customer.status = KYCVerificationStructs.KycStatus.Approved;
        emit CustomerKYCRequestApproved();
    } else {
        customer.status = KYCVerificationStructs.KycStatus.Declined;
    }
    banks[msg.sender].kycCount++;
    banks[msg.sender].customers.push(customerAddress);
}

   function getKycRequest(address customer) public view returns(KYCVerificationStructs.KYCRequest memory) {
     return kycRequests[customer];
   }
    

   function getRoleOfAddress(address userAddress) public view returns(string memory) {
     if (userAddress == admin) {
       return "Admin";
     } else if (banks[userAddress].bankAddress == userAddress) {
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

   function getBankInfo(address bankAddress) public view returns(KYCVerificationStructs.Bank memory) {
     return banks[bankAddress];
   }

   function getAllBankAddresses() public view returns(address[] memory) {
     return bankAddresses;
   }
   
   function getBankKycRequests(address bankAddress) public view returns(string[] memory) {
     return bankAddressToKycRequests[bankAddress];
   }


}
