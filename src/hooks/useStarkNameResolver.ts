import { useCallback } from "react";
import { RpcProvider } from "starknet";
import { useProvider } from "@starknet-react/core";
import { provider as fallbackProvider } from "@/providers/starknet-provider";

// export const useStarkNameResolver = (
//   setDistributionData: Dispatch<SetStateAction<IDistributionData[]>>
// ) => {
//   const [starkNameState, setStarkNameState] = useState<starkNameResolverState>(
//     {}
//   );

//   // Memoize the first item to prevent unnecessary recalculations
//   const { firstKey, nameToResolve } = useMemo(() => {
//     const firstKey = Object.keys(starkNameState)[0];

//     const firstItem = firstKey ? starkNameState[Number(firstKey)] : undefined;

//     return {
//       firstKey,
//       nameToResolve: firstItem?.starkName,
//     };
//   }, [starkNameState]);

//   // Use the hook to resolve address from stark name
//   const { data: resolvedAddress } = useStarkAddress({
//     name: nameToResolve,
//   });

//   // When resolvedAddress changes, update distributions and remove resolved entry from state
//   useEffect(() => {
//     if (!resolvedAddress || !firstKey) return;

//     const index = Number(firstKey);

//     setDistributionData((prevData) => {
//       const updatedDistributions = [...prevData];
//       updatedDistributions[index] = {
//         ...updatedDistributions[index],
//         address: resolvedAddress,
//       };
//       return updatedDistributions;
//     });

//     setStarkNameState((prev) => {
//       const newState = { ...prev };
//       delete newState[index];
//       return newState;
//     });
//   }, [resolvedAddress, firstKey, setDistributionData]);

//   // Memoize the queue function to prevent recreation on every render
//   const queueStarkNameResolution = useCallback(
//     (index: number, starkName: string) => {
//       if (!starkName.endsWith(".stark")) return;

//       setStarkNameState((prev) => {
//         // Only update if the entry doesn't exist or has changed
//         if (prev[index]?.starkName === starkName) return prev;

//         return {
//           ...prev,
//           [index]: { resolving: true, starkName },
//         };
//       });
//     },
//     []
//   );

//   return {
//     starkNameState,
//     queueStarkNameResolution,
//   };
// };

export const useStarkNameResolver = () => {
  const { provider: defaultProvider } = useProvider();

  const resolveStarkName = useCallback(
    async (starkName: string): Promise<string | null> => {
      if (!starkName || !starkName.endsWith(".stark")) return null;

      // 👇 Explicitly cast to RpcProvider if possible
      const activeProvider = defaultProvider
        ? defaultProvider
        : fallbackProvider;

      try {
        const address = await (
          activeProvider as RpcProvider
        ).getAddressFromStarkName(starkName);

        return address ?? null;
      } catch (error) {
        console.error(`❌ Failed to resolve Stark name "${starkName}":`, error);
        return null;
      }
    },
    [defaultProvider]
  );

  return { resolveStarkName };
};
