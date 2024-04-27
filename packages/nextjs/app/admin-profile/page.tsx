"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaginationButton, TransactionsTable } from "../blockexplorer/_components";
import type { NextPage } from "next";
import { Address } from "viem";
import { useAccount } from "wagmi";
import StringTable from "~~/components/StringTable";
import { AddressInput } from "~~/components/scaffold-eth";
import { useFetchBlocks, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const AdminPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { blocks, transactionReceipts, currentPage, totalBlocks, setCurrentPage, error } = useFetchBlocks();
  const [bankAddress, setBankAddress] = useState<Address>();
  const [bankName, setBankName] = useState<string>("");
  const [bankIFSC, setBankIFSC] = useState<string>("");
  const [bankBranch, setBankBranch] = useState<string>("");

  const router = useRouter();
  const { data: role } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getRoleOfAddress",
    args: [connectedAddress],
  });
  const { data: customers } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getCustomerAddresses",
  });
  const { data: banks } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getAllBankAddresses",
  });

  const { writeContractAsync } = useScaffoldWriteContract("KYCVerification");
  const { writeContractAsync: addBank } = useScaffoldWriteContract("KYCVerification");
  if (role !== "admin") {
    return (
      <div className="flex flex-col gap-2 bg-base-300 w-full h-full pt-4">
        <h1 className="text-2xl font-bold text-center">You are not authorized to access this page</h1>
      </div>
    );
  }
  return (
    <div className="flex gap-2 bg-base-300 w-full h-full pt-4">
      <div className="flex flex-col gap-2 w-[40%]">
        <StringTable
          title="Customers"
          strings={customers as string[]}
          onRowClick={address => {
            router.push(`/customer/${address}`);
          }}
        />
        <StringTable
          title="Banks"
          strings={banks as string[]}
          onRowClick={address => {
            if (!window.confirm("Are you sure you want to remove this bank?")) {
              router.push(`/bank/${address}`);
              return;
            }
            writeContractAsync({
              functionName: "removeBank",
              args: [address],
            });
          }}
        />
        <div className="flex flex-col gap-2 bg-base-100 p-2">
          <h1 className="text-2xl font-bold text-center">Add Bank</h1>
          <span className="text-center">Enter the details of the bank</span>
          <span className="">Address</span>
          <AddressInput value={bankAddress as Address} name="bankAddress" onChange={e => setBankAddress(e)} />
          <span className="">Bank Name</span>
          <input
            type="text"
            onChange={e => setBankName(e.target.value)}
            placeholder="Enter Bank Name"
            id="bankName"
            className="input input-bordered"
          />
          <span className="">Bank IFSC</span>
          <input
            type="text"
            onChange={e => setBankIFSC(e.target.value)}
            placeholder="Enter Bank IFSC"
            id="bankIFSC"
            className="input input-bordered"
          />
          <span className="">Bank Branch</span>
          <input
            type="text"
            onChange={e => setBankBranch(e.target.value)}
            placeholder="Enter Bank Branch"
            id="bankBranch"
            className="input input-bordered"
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              if (bankAddress === "" || bankName === "" || bankIFSC === "" || bankBranch === "") {
                notification.error("Please fill all the fields");
              }
              addBank({
                functionName: "addBank",
                args: [bankName, bankAddress, bankIFSC, bankBranch],
              });
            }}
          >
            Add Bank
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-[70%]">
        <TransactionsTable blocks={blocks} transactionReceipts={transactionReceipts} />
        <PaginationButton currentPage={currentPage} totalItems={Number(totalBlocks)} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default AdminPage;
