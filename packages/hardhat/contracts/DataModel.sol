pragma solidity >=0.8.0 <0.9.0;

library KYCVerificationStructs {
   struct Customer {
        address customerAddress;
        string name;
        string age;
        string phoneNumber;
        string aadharIPFS; //derived from national id
        string panIPFS;
        string photoIPFS;
        KycStatus status;
    }

    struct Bank {
        string name;
        uint256 kycCount; //count of how many requests a specific bank has requested
        address bankAddress;
        address[] customers;
    }

    struct KYCRequest {
      string aadharHash;
      string panHash;
      string photoHash;
    }

    enum BankActions {
        AddKYCRequest, //0
        RemoveKYCRequest, //1
        ApproveKYC, //2
        DeclineKYC, //3
        AddCustomer, //4
        RemoveCustomer, //5
        ModifyCustomer, //6
        ViewCustomer //7
    }

    enum KycStatus {
        Pending, //0
        Approved, //1
        Declined //2
    }
}