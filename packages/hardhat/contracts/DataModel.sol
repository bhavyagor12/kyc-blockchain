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
        uint256 regNumber;
        uint256 kycCount; //count of how many requests a specific bank has requested
        address ethAddress;
        bool isAllowedToAddCustomer; //permission to add new customers,only given to a few banks that the super admin trusts with identity validation and verification
        bool kycPrivilege; //permisiion to request/delete new KYC reports on customers and to view the
    }

    struct KYCRequest {
        uint256 customerUniqueId;
        address bankAddress;
        bool adminResponse;
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
