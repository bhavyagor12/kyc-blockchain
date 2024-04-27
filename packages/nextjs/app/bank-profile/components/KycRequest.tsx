import { useEffect } from "react";
import { GATEWAY_URL } from "~~/app/user-profile/components/UserRegForm";
import { Profile } from "~~/components/Profile";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const KycRequest = ({ requestId }: { requestId: string }) => {
  const { data: kycRequest, refetch: refetchKycRequest } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getKycRequest",
    args: [requestId],
  });
  const { data: customerInfo, refetch: readCustomerInfo } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getCustomerInfo",
    args: [kycRequest?.customerAddress],
  });

  const { writeContractAsync } = useScaffoldWriteContract("KYCVerification");

  useEffect(() => {
    if (!requestId) return;
    refetchKycRequest();
  }, [requestId, refetchKycRequest]);

  useEffect(() => {
    if (!kycRequest) return;
    readCustomerInfo();
  }, [kycRequest, readCustomerInfo]);
  console.log({ kycRequest, customerInfo });
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex flex-col gap-4">
        <Profile user="Customer" data={customerInfo} address={kycRequest?.customerAddress as string} />
      </div>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex items-center gap-4">
          <div className="bg-base-100 p-4 flex flex-col rounded-md">
            Details of KYC fetched from User Profile
            {customerInfo && customerInfo.aadharIPFS && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={`${GATEWAY_URL}/${customerInfo.aadharIPFS}`} alt="aadhar" className="w-52 h-52" />
            )}
            {customerInfo && customerInfo.panIPFS && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={`${GATEWAY_URL}/${customerInfo.panIPFS}`} alt="aadhar" className="w-52 h-52" />
            )}
            {customerInfo && customerInfo.photoIPFS && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={`${GATEWAY_URL}/${customerInfo.photoIPFS}`} alt="aadhar" className="w-52 h-52" />
            )}
          </div>
          <div className="bg-base-100 p-4 flex flex-col rounded-md">
            Details of KYC fetched from KYC Request
            {kycRequest && kycRequest?.aadharHash && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={`${GATEWAY_URL}/${kycRequest.aadharHash}`} alt="aadhar" className="w-52 h-52" />
            )}
            {kycRequest && kycRequest?.panHash && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={`${GATEWAY_URL}/${kycRequest.panHash}`} alt="aadhar" className="w-52 h-52" />
            )}
            {kycRequest && kycRequest?.photoHash && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={`${GATEWAY_URL}/${kycRequest?.photoHash}`} alt="aadhar" className="w-52 h-52" />
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <button
            className="btn btn-error"
            onClick={() =>
              writeContractAsync({
                functionName: "verifyKyc",
                args: [kycRequest?.customerAddress, BigInt(0)],
              })
            }
          >
            Reject
          </button>
          <button
            className="btn btn-success"
            onClick={() =>
              writeContractAsync({
                functionName: "verifyKyc",
                args: [kycRequest?.customerAddress, BigInt(1)],
              })
            }
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default KycRequest;
