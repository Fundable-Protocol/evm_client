import InputWithLabel from "@/components/molecules/InputWithLabel";
import { Button } from "@/components/ui/button";
import { generateRandomUUID, isValidTweetUrl, tryCatch } from "@/lib/utils";
import DistributionApiService from "@/services/api/distributionService";
import { IDistributionData, IDistributionInfo } from "@/types/distribution";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";

interface TwitterAddressExtractorProps {
  address: string;
  distributionInfo: IDistributionInfo;
  setDistributionInfo: React.Dispatch<React.SetStateAction<IDistributionInfo>>;
  setDistributionData: React.Dispatch<
    React.SetStateAction<IDistributionData[]>
  >;
}

const TwitterAddressExtractor: React.FC<TwitterAddressExtractorProps> = ({
  address,
  distributionInfo,
  setDistributionInfo,
  setDistributionData,
}) => {
  const [isExtractingAddresses, setIsExtractingAddresses] = useState(false);

  const handleTwitterUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDistributionInfo((prev) => ({
      ...prev,
      twitterUrl: e.target.value,
    }));
  };

  const handleExtractAddresses = async () => {
    if (!distributionInfo.twitterUrl?.trim()) {
      toast.error("Please enter a X tweet URL first");
      return;
    }

    if (!isValidTweetUrl(distributionInfo.twitterUrl)) {
      toast.error("Please enter a valid X tweet URL");
      return;
    }

    setIsExtractingAddresses(true);

    toast.loading("Extracting addresses from X tweet URL...", {
      duration: Number.POSITIVE_INFINITY,
    });

    try {
      const { data, error } = await tryCatch(
        DistributionApiService.extractAddressesFromTweetUrl(address!, {
          url: distributionInfo.twitterUrl,
          platform: "twitter",
          addressType: "starknet",
        })
      );

      toast.dismiss();

      if (!data?.success) {
        toast.error(
          error?.message || "Unable to extract addresses, try again later"
        );
        return;
      }

      if (!data.data?.addresses?.length) {
        toast.error("No addresses found in the provided X tweet URL");
        return;
      }

      // // Convert extracted addresses to distribution data format
      const newDistributionData = data.data.addresses.map(({ address }) => ({
        id: generateRandomUUID(),
        address: address,
        amount:
          distributionInfo.type === "equal"
            ? String(distributionInfo.amount || 0)
            : "",
        label: "",
      }));

      // // Replace existing data with extracted addresses
      setDistributionData(newDistributionData);

      toast.success(
        `Successfully extracted ${data.data.total} addresses from X tweet URL`,
        {
          duration: 3000,
        }
      );

      // Clear the Twitter URL after successful extraction
      setDistributionInfo((prev) => ({
        ...prev,
        twitterUrl: "",
      }));
    } catch {
      toast.dismiss();
      toast.error("Unable to extract addresses, try again later");
    } finally {
      setIsExtractingAddresses(false);
    }
  };

  return (
    <div className="flex gap-x-2 md:gap-x-6">
      <InputWithLabel
        placeholder="Enter an X post URL (https://x.com/username/status/1234567890) to extract Starknet addresses from replies."
        value={distributionInfo.twitterUrl || ""}
        onChange={handleTwitterUrlChange}
        className="placeholder:text-fundable-light-grey h-10 placeholder:text-xs md:placeholder:text-sm"
      />

      <Button
        variant="gradient"
        className="rounded h-10  truncate"
        onClick={handleExtractAddresses}
        disabled={
          !address ||
          isExtractingAddresses ||
          !distributionInfo.twitterUrl?.trim()
        }
      >
        {isExtractingAddresses ? "Extracting..." : "Extract Addresses"}
      </Button>
    </div>
  );
};

export default TwitterAddressExtractor;
