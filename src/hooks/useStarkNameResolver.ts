import { useState, useEffect } from "react";
import { useStarkAddress } from "@starknet-react/core";
import {
  DistributionDataProps,
  starkNameResolverState,
} from "@/types/distribution";

export const useStarkNameResolver = ({
  distributionData,
  setDistributionData,
}: DistributionDataProps) => {
  const [starkNameState, setStarkNameState] = useState<starkNameResolverState>(
    {}
  );

  // Get first Stark name to resolve from state
  const firstKey = Object.keys(starkNameState)[0];
  const firstItem = firstKey ? starkNameState[Number(firstKey)] : undefined;
  const nameToResolve = firstItem?.starkName;

  // Use the hook to resolve address from stark name
  const { data: resolvedAddress } = useStarkAddress({ name: nameToResolve });

  // When resolvedAddress changes, update distributions and remove resolved entry from state
  useEffect(() => {
    if (resolvedAddress && firstKey) {
      const index = Number(firstKey);

      const updatedDistributions = [...distributionData!];

      updatedDistributions[index] = {
        ...updatedDistributions[index],
        address: resolvedAddress,
      };

      setDistributionData(updatedDistributions);

      setStarkNameState((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
    }
  }, [resolvedAddress, firstKey, distributionData, setDistributionData]);

  // Public function to queue a new stark name for resolution
  const queueStarkNameResolution = (index: number, starkName: string) => {
    setStarkNameState((prev) => ({
      ...prev,
      [index]: { resolving: true, starkName },
    }));
  };

  return {
    starkNameState,
    queueStarkNameResolution,
  };
};
