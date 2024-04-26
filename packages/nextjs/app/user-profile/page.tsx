"use client";

import { UserRegForm } from "./components/UserRegForm";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

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
        <UserRegForm edit={true} isReadOnly={true} customerInfo={customerInfo} />
      )}
    </div>
  );
};

export default UserProfile;
