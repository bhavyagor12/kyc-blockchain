//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import { KYCVerificationStructs } from "./DataModel.sol";

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

	mapping(address => KYCVerificationStructs.Customer)
		public customersInformation; //mapping a customers's uniqueId to CUstomer Struct
	mapping(address => KYCVerificationStructs.Bank) public banks; //  Mapping a bank's address to the Bank
	mapping(string => KYCVerificationStructs.KYCRequest) public kycRequests;
	mapping(address => string[]) public bankAddressToKycRequests;
	//mapping a customers id to KYC Request
	mapping(address => mapping(int256 => uint256)) bankActionsAudit; //to track each bank and their actions with time stamp
	modifier onlyAdmin() {
		require(msg.sender == admin, "Only admin can call this function");
		_;
	}

	modifier onlyBank() {
		require(
			banks[msg.sender].bankAddress == msg.sender,
			"Only bank can call this function"
		);
		_;
	}

	constructor() {
		emit ContractInitialized();
		admin = msg.sender;
		KYCVerificationStructs.Bank memory bank = KYCVerificationStructs.Bank(
			"SBI",
			0,
			msg.sender,
			new address[](0),
			"SBI0001",
			"Mumbai"
		);
		banks[msg.sender] = bank;
		bankAddresses.push(msg.sender);
		KYCVerificationStructs.Bank memory bank1 = KYCVerificationStructs.Bank(
			"ICICI",
			0,
			0xD1A8b77A676A5C8d1f11226C9b491C9a0b76A160,
			new address[](0),
			"ICICI0001",
			"Mumbai"
		);
		banks[0xD1A8b77A676A5C8d1f11226C9b491C9a0b76A160] = bank1;
		bankAddresses.push(0xD1A8b77A676A5C8d1f11226C9b491C9a0b76A160);
	}

	function addCustomer(
		string memory name,
		string memory age,
		string memory phoneNumber,
		string memory aadharIPFS,
		string memory panIPFS,
		string memory photoIPFS
	) public {
		require(
			customersInformation[msg.sender].customerAddress != msg.sender,
			"Customer already exists"
		);
		KYCVerificationStructs.Customer
			memory newCustomer = KYCVerificationStructs.Customer(
				msg.sender,
				name,
				age,
				phoneNumber,
				aadharIPFS,
				panIPFS,
				photoIPFS,
				KYCVerificationStructs.KycStatus.Pending,
				new address[](0)
			);
		customersInformation[msg.sender] = newCustomer;
		customerAddresses.push(msg.sender);
		emit NewCustomerCreated(msg.sender);
	}

	function updateCustomer(
		string memory name,
		string memory age,
		string memory phoneNumber,
		string memory aadharIPFS,
		string memory panIPFS,
		string memory photoIPFS
	) public {
		require(
			customersInformation[msg.sender].customerAddress == msg.sender,
			"Customer does not exist"
		);
		KYCVerificationStructs.Customer storage customer = customersInformation[
			msg.sender
		];
		KYCVerificationStructs.Customer
			memory updatedCustomer = KYCVerificationStructs.Customer(
				msg.sender,
				name,
				age,
				phoneNumber,
				aadharIPFS,
				panIPFS,
				photoIPFS,
				KYCVerificationStructs.KycStatus.Pending,
				customer.banksAccounts
			);
		customersInformation[msg.sender] = updatedCustomer;
		emit CustomerInfoModified();
	}

	function removeCustomer(address customerAddress) public onlyAdmin {
		require(
			customersInformation[customerAddress].customerAddress ==
				customerAddress,
			"Customer does not exist"
		);
		delete customersInformation[customerAddress];
		emit CustomerRemoved();
	}

	function addBank(
		string memory name,
		address bankAddress,
		string memory ifsc,
		string memory branch
	) public onlyAdmin {
		require(
			banks[bankAddress].bankAddress != msg.sender,
			"Bank already exists"
		);
		KYCVerificationStructs.Bank memory newBank = KYCVerificationStructs
			.Bank(name, 0, bankAddress, new address[](0), ifsc, branch);
		banks[bankAddress] = newBank;
		bankAddresses.push(bankAddress);
		emit NewBankCreated();
	}

	function sendDocsForKyc(
		string memory _aadharHash,
		string memory _panHash,
		string memory _photoHash,
		address _bankAddress
	) public {
		require(
			customersInformation[msg.sender].customerAddress == msg.sender,
			"Customer does not exist"
		);
		KYCVerificationStructs.Customer storage customer = customersInformation[
			msg.sender
		];
		require(
			customer.status != KYCVerificationStructs.KycStatus.Approved,
			"KYC Request already approved"
		);
		require(
			customer.status != KYCVerificationStructs.KycStatus.UnderReview,
			"KYC Request already under review"
		);
		string memory requestId = string.concat(
			_aadharHash,
			_panHash,
			_photoHash
		);
		KYCVerificationStructs.KYCRequest
			memory newRequest = KYCVerificationStructs.KYCRequest(
				requestId,
				_aadharHash,
				_panHash,
				_photoHash,
				msg.sender
			);
		kycRequests[requestId] = newRequest;
		bankAddressToKycRequests[_bankAddress].push(newRequest.requestId);
		customer.status = KYCVerificationStructs.KycStatus.UnderReview;
		emit CustomerKYCRequestAdded();
	}

	function openBankAccount(address bankAddress) public {
		require(
			customersInformation[msg.sender].customerAddress == msg.sender,
			"Customer does not exist"
		);
		require(
			customersInformation[msg.sender].status ==
				KYCVerificationStructs.KycStatus.Approved,
			"KYC not approved"
		);
		KYCVerificationStructs.Customer storage customer = customersInformation[
			msg.sender
		];
		if (customer.banksAccounts.length > 0) {
			for (uint i = 0; i < customer.banksAccounts.length; i++) {
				if (customer.banksAccounts[i] == bankAddress) {
					revert("Bank Account already exists");
				}
			}
		}
		customer.banksAccounts.push(bankAddress);
		KYCVerificationStructs.Bank storage bank = banks[bankAddress];
		bank.customers.push(msg.sender);
	}

	function verifyKyc(
		address customerAddress,
		uint256 status,
		string memory requestId
	) public onlyBank {
		require(
			customersInformation[customerAddress].customerAddress ==
				customerAddress,
			"Customer does not exist"
		);
		KYCVerificationStructs.Customer storage customer = customersInformation[
			customerAddress
		];
		require(
			customer.status == KYCVerificationStructs.KycStatus.UnderReview,
			"KYC Request not under review"
		);
		if (status == 1) {
			KYCVerificationStructs.Bank storage bank = banks[msg.sender];
			customer.status = KYCVerificationStructs.KycStatus.Approved;
			bool doesBankCointainCustomer = false;
			bool doesCustomerContainBank = false;
			for (uint i = 0; i < bank.customers.length; i++) {
				if (customerAddress == bank.customers[i]) {
					doesBankCointainCustomer = true;
					break;
				}
			}
			if (!doesBankCointainCustomer) {
				bank.customers.push(customerAddress);
				bank.kycCount++;
			}
			for (uint i = 0; i < customer.banksAccounts.length; i++) {
				if (msg.sender == customer.banksAccounts[i]) {
					doesCustomerContainBank = true;
					break;
				}
			}
			if (!doesCustomerContainBank) {
				customer.banksAccounts.push(msg.sender);
			}
			emit CustomerKYCRequestApproved();
		} else {
			customer.status = KYCVerificationStructs.KycStatus.Declined;
		}
		string[] memory requestIds = bankAddressToKycRequests[msg.sender];
		for (uint i = 0; i < requestIds.length; i++) {
			if (
				keccak256(abi.encodePacked(requestIds[i])) ==
				keccak256(abi.encodePacked(requestId))
			) {
				delete bankAddressToKycRequests[msg.sender][i];
				break;
			}
		}
		delete kycRequests[requestId];
	}

	function removeBankAccount(address bankAddress) public {
		require(
			customersInformation[msg.sender].customerAddress == msg.sender,
			"Customer does not exist"
		);
		KYCVerificationStructs.Customer storage customer = customersInformation[
			msg.sender
		];
		address[] memory bankAccounts = customer.banksAccounts;
		for (uint i = 0; i < bankAccounts.length; i++) {
			if (bankAccounts[i] == bankAddress) {
				delete customer.banksAccounts[i];
				break;
			}
		}
		if (customer.banksAccounts.length == 0) {
			customer.status = KYCVerificationStructs.KycStatus.Pending;
			customer.banksAccounts = new address[](0);
		}
		KYCVerificationStructs.Bank storage bank = banks[bankAddress];
		for (uint i = 0; i < bank.customers.length; i++) {
			if (bank.customers[i] == msg.sender) {
				delete bank.customers[i];
				break;
			}
		}
		if (bank.customers.length == 0) {
			bank.kycCount = 0;
			bank.customers = new address[](0);
		}
	}

	function removeBank(address bankAddress) public onlyAdmin {
		require(
			banks[bankAddress].bankAddress == bankAddress,
			"Bank does not exist"
		);
		delete banks[bankAddress];
		for (uint i = 0; i < bankAddresses.length; i++) {
			if (bankAddresses[i] == bankAddress) {
				delete bankAddresses[i];
				break;
			}
		}
		emit BankRemoved();
	}

	function getKycRequest(
		string memory requestId
	) public view returns (KYCVerificationStructs.KYCRequest memory) {
		return kycRequests[requestId];
	}

	function getRoleOfAddress(
		address userAddress
	) public view returns (string memory) {
		if (userAddress == admin) {
			return "Admin";
		} else if (banks[userAddress].bankAddress == userAddress) {
			return "Bank";
		} else if (
			customersInformation[userAddress].customerAddress == userAddress
		) {
			return "Customer";
		} else {
			return "User";
		}
	}

	function getCustomerInfo(
		address customerAddress
	) public view returns (KYCVerificationStructs.Customer memory) {
		return customersInformation[customerAddress];
	}

	function getBankInfo(
		address bankAddress
	) public view returns (KYCVerificationStructs.Bank memory) {
		return banks[bankAddress];
	}

	function getCustomerAddresses() public view returns (address[] memory) {
		return customerAddresses;
	}

	function getAllBankAddresses() public view returns (address[] memory) {
		return bankAddresses;
	}

	function getBankKycRequests(
		address bankAddress
	) public view returns (string[] memory) {
		return bankAddressToKycRequests[bankAddress];
	}
}
