import {
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { getEnsAddress } from "@wagmi/core";
import { mainnetConfig } from "@/config";
import {
  IDistributionData,
  ensResolverState,
} from "@/types/distribution";

export const useENSResolver = (
  setDistributionData: Dispatch<SetStateAction<IDistributionData[]>>
) => {
  const [ensState, setEnsState] = useState<ensResolverState>({});

  // Resolve all ENS names in parallel
  const resolveAllENS = useCallback(
    async (distributionData: IDistributionData[]) => {
      const ensNamesToResolve: Array<{ index: number; ensName: string }> = [];

      distributionData.forEach((row, index) => {
        if (row.address && row.address.endsWith(".eth") && !row.address.startsWith("0x")) {
          ensNamesToResolve.push({ index, ensName: row.address });
        }
      });

      if (ensNamesToResolve.length === 0) return;

      // Set all as resolving
      setEnsState((prev: ensResolverState) => {
        const newState = { ...prev };
        ensNamesToResolve.forEach(({ index }) => {
          newState[index] = { resolving: true, ensName: distributionData[index].address! };
        });
        return newState;
      });

      // Resolve all in parallel
      const resolutionPromises = ensNamesToResolve.map(async ({ index, ensName }) => {
        try {
          const resolvedAddress = await getEnsAddress(mainnetConfig, {
            name: ensName,
          });

          if (resolvedAddress) {
            setDistributionData((prevData: IDistributionData[]) => {
              const updatedDistributions = [...prevData];
              updatedDistributions[index] = {
                ...updatedDistributions[index],
                address: resolvedAddress,
              };
              return updatedDistributions;
            });
          }

          // Remove from state after resolution (success or failure)
          setEnsState((prev: ensResolverState) => {
            const newState = { ...prev };
            delete newState[index];
            return newState;
          });
        } catch (error) {
          console.error(`Error resolving ENS name ${ensName}:`, error);
          // Remove from state on error
          setEnsState((prev: ensResolverState) => {
            const newState = { ...prev };
            delete newState[index];
            return newState;
          });
        }
      });

      await Promise.all(resolutionPromises);
    },
    [setDistributionData]
  );

  return {
    ensState,
    resolveAllENS,
  };
};

