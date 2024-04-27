"use client";

import { useEffect, useState } from "react";
import UserKYCStatus from "./components/UserKYCStatus";
import { UserRegForm } from "./components/UserRegForm";
import { Switch } from "@mui/material";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Profile } from "~~/components/Profile";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const processStatus = (status: number): string => {
  if (status === 0) return "Pending";
  if (status === 1) return "Verified";
  if (status === 2) return "Rejected";
  return "Pending";
};

const UserProfile: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: customerInfo, refetch } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getCustomerInfo",
    args: [connectedAddress],
  });
  const [edit, setEdit] = useState<boolean>(false);
  useEffect(() => {
    refetch();
  }, [connectedAddress, refetch]);
  return (
    <div className="bg-base-300 w-full h-full">
      <h1 className="text-center">
        <span className="block text-2xl mb-2">Welcome to your Customer Profile</span>
      </h1>
      {!customerInfo || customerInfo?.name === "" ? (
        <UserRegForm edit={false} isReadOnly={false} />
      ) : (
        <>
          Edit <Switch onChange={() => setEdit(!edit)} value={edit} />
          {edit ? (
            <UserRegForm edit={edit} isReadOnly={false} customerInfo={customerInfo} />
          ) : (
            <Profile user="User" data={customerInfo} address={connectedAddress as string} />
          )}
          <UserKYCStatus kycStatus={processStatus(customerInfo.status)} />
        </>
      )}
    </div>
  );
};

export default UserProfile;
