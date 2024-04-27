/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    KYCVerification: {
      address: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [],
          name: "BankBlockedFromKYC",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [],
          name: "BankRemoved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [],
          name: "ContractInitialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [],
          name: "CustomerInfoModified",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [],
          name: "CustomerKYCRequestAdded",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [],
          name: "CustomerKYCRequestApproved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [],
          name: "CustomerKYCRequestRemoved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [],
          name: "CustomerRemoved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [],
          name: "NewBankCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "customerAddress",
              type: "address",
            },
          ],
          name: "NewCustomerCreated",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "registrationNumber",
              type: "uint256",
            },
          ],
          name: "addBank",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "age",
              type: "string",
            },
            {
              internalType: "string",
              name: "phoneNumber",
              type: "string",
            },
            {
              internalType: "string",
              name: "aadharIPFS",
              type: "string",
            },
            {
              internalType: "string",
              name: "panIPFS",
              type: "string",
            },
            {
              internalType: "string",
              name: "photoIPFS",
              type: "string",
            },
          ],
          name: "addCustomer",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "bankAddressToKycRequests",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "bankAddresses",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "banks",
          outputs: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "kycCount",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "bankAddress",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "banksRegistrationNumberMapping",
          outputs: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "kycCount",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "bankAddress",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "customerAddresses",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "customersInformation",
          outputs: [
            {
              internalType: "address",
              name: "customerAddress",
              type: "address",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "age",
              type: "string",
            },
            {
              internalType: "string",
              name: "phoneNumber",
              type: "string",
            },
            {
              internalType: "string",
              name: "aadharIPFS",
              type: "string",
            },
            {
              internalType: "string",
              name: "panIPFS",
              type: "string",
            },
            {
              internalType: "string",
              name: "photoIPFS",
              type: "string",
            },
            {
              internalType: "enum KYCVerificationStructs.KycStatus",
              name: "status",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getAllBankAddresses",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "bankAddress",
              type: "address",
            },
          ],
          name: "getBankInfo",
          outputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "kycCount",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "bankAddress",
                  type: "address",
                },
                {
                  internalType: "address[]",
                  name: "customers",
                  type: "address[]",
                },
              ],
              internalType: "struct KYCVerificationStructs.Bank",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "bankAddress",
              type: "address",
            },
          ],
          name: "getBankKycRequests",
          outputs: [
            {
              internalType: "string[]",
              name: "",
              type: "string[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "customerAddress",
              type: "address",
            },
          ],
          name: "getCustomerInfo",
          outputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "customerAddress",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "age",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "phoneNumber",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "aadharIPFS",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "panIPFS",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "photoIPFS",
                  type: "string",
                },
                {
                  internalType: "enum KYCVerificationStructs.KycStatus",
                  name: "status",
                  type: "uint8",
                },
              ],
              internalType: "struct KYCVerificationStructs.Customer",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "requestId",
              type: "string",
            },
          ],
          name: "getKycRequest",
          outputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "requestId",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "aadharHash",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "panHash",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "photoHash",
                  type: "string",
                },
                {
                  internalType: "address",
                  name: "customerAddress",
                  type: "address",
                },
              ],
              internalType: "struct KYCVerificationStructs.KYCRequest",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "userAddress",
              type: "address",
            },
          ],
          name: "getRoleOfAddress",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          name: "kycRequests",
          outputs: [
            {
              internalType: "string",
              name: "requestId",
              type: "string",
            },
            {
              internalType: "string",
              name: "aadharHash",
              type: "string",
            },
            {
              internalType: "string",
              name: "panHash",
              type: "string",
            },
            {
              internalType: "string",
              name: "photoHash",
              type: "string",
            },
            {
              internalType: "address",
              name: "customerAddress",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "customerAddress",
              type: "address",
            },
          ],
          name: "removeCustomer",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_aadharHash",
              type: "string",
            },
            {
              internalType: "string",
              name: "_panHash",
              type: "string",
            },
            {
              internalType: "string",
              name: "_photoHash",
              type: "string",
            },
            {
              internalType: "address",
              name: "_bankAddress",
              type: "address",
            },
          ],
          name: "sendDocsForKyc",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "age",
              type: "string",
            },
            {
              internalType: "string",
              name: "phoneNumber",
              type: "string",
            },
            {
              internalType: "string",
              name: "aadharIPFS",
              type: "string",
            },
            {
              internalType: "string",
              name: "panIPFS",
              type: "string",
            },
            {
              internalType: "string",
              name: "photoIPFS",
              type: "string",
            },
          ],
          name: "updateCustomer",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "customerAddress",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "status",
              type: "uint256",
            },
          ],
          name: "verifyKyc",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
