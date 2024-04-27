import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GATEWAY_URL } from "~~/app/user-profile/components/UserRegForm";
import { Profile } from "~~/components/Profile";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const compareHashes = (
  sourceAadharHash: string,
  sourcePanHash: string,
  sourcePhotoHash: string,
  destinationAadharIPFS: string,
  destinationPanIPFS: string,
  destinationPhotoIPFS: string,
) => {
  if (
    sourceAadharHash === destinationAadharIPFS &&
    sourcePanHash === destinationPanIPFS &&
    sourcePhotoHash === destinationPhotoIPFS
  ) {
    return true;
  }

  return false;
};

const KycRequest = ({ requestId }: { requestId: string }) => {
  const router = useRouter();
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
  return (
    <div className="flex items-start justify-center gap-4">
      {requestId !== "" && (
        <>
          <div className="flex flex-col gap-4">
            <Profile user="Customer" data={customerInfo} address={kycRequest?.customerAddress as string} />
          </div>
          <div className="flex flex-col gap-4 items-center">
            <div className="flex items-center gap-4">
              <div className="bg-base-100 p-4 flex flex-col items-center gap-4 rounded-md">
                Details of KYC fetched from User Profile
                {customerInfo && customerInfo.aadharIPFS && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={`${GATEWAY_URL}/${customerInfo.aadharIPFS}`} alt="aadhar" className="w-32 h-32" />
                )}
                {customerInfo && customerInfo.panIPFS && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={`${GATEWAY_URL}/${customerInfo.panIPFS}`} alt="aadhar" className="w-32 h-32" />
                )}
                {customerInfo && customerInfo.photoIPFS && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={`${GATEWAY_URL}/${customerInfo.photoIPFS}`} alt="aadhar" className="w-32 h-32" />
                )}
              </div>
              <div className="bg-base-100 p-4 flex flex-col items-center gap-4 rounded-md">
                Details of KYC fetched from KYC Request
                {kycRequest && kycRequest?.aadharHash && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={`${GATEWAY_URL}/${kycRequest.aadharHash}`} alt="aadhar" className="w-32 h-32" />
                )}
                {kycRequest && kycRequest?.panHash && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={`${GATEWAY_URL}/${kycRequest.panHash}`} alt="aadhar" className="w-32 h-32" />
                )}
                {kycRequest && kycRequest?.photoHash && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={`${GATEWAY_URL}/${kycRequest?.photoHash}`} alt="aadhar" className="w-32 h-32" />
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="btn btn-error"
                onClick={() =>
                  writeContractAsync({
                    functionName: "verifyKyc",
                    args: [kycRequest?.customerAddress, BigInt(0), requestId],
                  })
                }
              >
                Reject
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  if (
                    compareHashes(
                      kycRequest?.aadharHash as string,
                      kycRequest?.panHash as string,
                      kycRequest?.photoHash as string,
                      customerInfo?.aadharIPFS as string,
                      customerInfo?.panIPFS as string,
                      customerInfo?.photoIPFS as string,
                    )
                  ) {
                    notification.success("Hashes match");
                  } else {
                    notification.warning("Hashes do not match, check output carefully!!");
                  }
                  writeContractAsync({
                    functionName: "verifyKyc",
                    args: [kycRequest?.customerAddress, BigInt(1), requestId],
                  });
                  router.push("/");
                }}
              >
                Approve
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KycRequest;
