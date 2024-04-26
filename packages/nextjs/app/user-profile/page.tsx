"use client";

import UserKYCStatus from "./components/UserKYCStatus";
import { UserRegForm } from "./components/UserRegForm";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const processStatus = (status: number) => {
  if (status === 0) return "Pending";
  if (status === 1) return "Verified";
  if (status === 2) return "Rejected";
};

const UserProfile: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: customerInfo } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getCustomerInfo",
    args: [connectedAddress],
  });
  return (
    <div className="bg-base-300 w-full h-full">
      <h1 className="text-center">
        <span className="block text-2xl mb-2">Welcome to your Customer Profile</span>
      </h1>
      {!customerInfo ? (
        <div className="flex justify-center items-center h-96">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      ) : (
        <>
          <UserRegForm edit={true} isReadOnly={false} customerInfo={customerInfo} />
          <UserKYCStatus kycStatus={processStatus(customerInfo.status)} />
        </>
      )}
    </div>
  );
};

export default UserProfile;
