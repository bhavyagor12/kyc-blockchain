"use client";

import { useEffect, useState } from "react";
import KycRequest from "./components/KycRequest";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import StringTable from "~~/components/StringTable";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const BankProfile: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [requestId, setRequestId] = useState<string>("");
  const { data: bankInfo } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getBankInfo",
    args: [connectedAddress],
  });
  const { data: kycRequests, refetch: refetchBankKycRequests } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getBankKycRequests",
    args: [connectedAddress],
  });
  console.log(connectedAddress);
  useEffect(() => {
    if (!connectedAddress) return;
    refetchBankKycRequests();
  }, [connectedAddress, refetchBankKycRequests]);
  console.log("kycRequests", kycRequests, bankInfo);
  return (
    <div className="bg-base-300 w-full h-full">
      <h1 className="text-center">
        <span className="block text-2xl mb-2">Welcome to {bankInfo?.name} Bank Profile</span>
      </h1>
      <StringTable
        title="Open Requests For KYC"
        strings={kycRequests as string[]}
        onRowClick={string => {
          setRequestId(string);
        }}
      />
      <KycRequest key={requestId} requestId={requestId} />
    </div>
  );
};

export default BankProfile;
