"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import { parseUnits } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

import { config } from "@/config";
import { useEVM } from "@/hooks/useEVM";
import {
  ERC20_OFFRAMP_ABI,
  OFFRAMP_MESSAGES,
  OFFRAMP_POLLING,
  OFFRAMP_STORAGE_KEYS,
} from "@/lib/offramp/offramp.constants";
import {
  getOfframpBalanceState,
  getPollingInterval,
  getRemainingSeconds,
  isTerminalOfframpStatus,
  isWalletRejection,
  normalizeManualOfframpOrder,
} from "@/lib/offramp/offramp.utils";
import { offrampService } from "@/services/api/offrampService";
import {
  OFFRAMP_MODES,
  OFFRAMP_PUBLIC_STAGES,
  type AggregatedOfframpRates,
  type OfframpAccount,
  type OfframpAsset,
  type OfframpBank,
  type OfframpCountry,
  type OfframpMode,
  type OfframpOrder,
  type OfframpPublicStatus,
  type StoredManualOfframp,
} from "@/types/offramp";

const getAssetKey = (asset: OfframpAsset) =>
  `${asset.network}:${asset.contractAddress.toLowerCase()}`;

export function useOfframpFlow() {
  const { address, chainId, isConnected } = useAccount();
  const { connect, switchNetwork } = useEVM();
  const { writeContractAsync } = useWriteContract();

  const [mode, setModeState] = useState<OfframpMode>(
    isConnected ? OFFRAMP_MODES.connected : OFFRAMP_MODES.manual,
  );
  const [assets, setAssets] = useState<OfframpAsset[]>([]);
  const [countries, setCountries] = useState<OfframpCountry[]>([]);
  const [banks, setBanks] = useState<OfframpBank[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedAssetKey, setSelectedAssetKey] = useState("");
  const [countryCode, setCountryCode] = useState("NG");
  const [amount, setAmount] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [email, setEmail] = useState("");
  const [verifiedAccount, setVerifiedAccount] =
    useState<OfframpAccount | null>(null);
  const [rates, setRates] = useState<AggregatedOfframpRates | null>(null);
  const [order, setOrder] = useState<OfframpOrder | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [publicStatus, setPublicStatus] =
    useState<OfframpPublicStatus | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isLoadingDiscovery, setIsLoadingDiscovery] = useState(true);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isSendingDeposit, setIsSendingDeposit] = useState(false);
  const [isConfirmingDeposit, setIsConfirmingDeposit] = useState(false);
  const [discoveryError, setDiscoveryError] = useState("");
  const [rateError, setRateError] = useState("");
  const [accountError, setAccountError] = useState("");
  const [actionError, setActionError] = useState("");
  const [statusError, setStatusError] = useState("");

  const networks = useMemo(
    () =>
      Array.from(new Set(assets.map((asset) => asset.network))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [assets],
  );

  const connectedAssets = useMemo(
    () => assets.filter((asset) => asset.chainId === chainId),
    [assets, chainId],
  );

  const eligibleAssets = useMemo(
    () =>
      mode === OFFRAMP_MODES.connected
        ? connectedAssets
        : assets.filter((asset) => asset.network === selectedNetwork),
    [assets, connectedAssets, mode, selectedNetwork],
  );

  const selectedAsset = useMemo(
    () =>
      eligibleAssets.find((asset) => getAssetKey(asset) === selectedAssetKey) ??
      null,
    [eligibleAssets, selectedAssetKey],
  );

  const selectedCountry = useMemo(
    () => countries.find((country) => country.code === countryCode) ?? null,
    [countries, countryCode],
  );

  const numericAmount = Number(amount);
  const bestRate = rates?.best ?? null;
  const hasSupportedConnectedNetwork = connectedAssets.length > 0;

  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    abi: ERC20_OFFRAMP_ABI,
    address: selectedAsset?.contractAddress,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled:
        mode === OFFRAMP_MODES.connected &&
        Boolean(address && selectedAsset?.contractAddress),
    },
  });

  const tokenBalance = useMemo(() => {
    if (typeof balanceData !== "bigint" || !selectedAsset) return null;
    return Number(balanceData) / 10 ** selectedAsset.decimals;
  }, [balanceData, selectedAsset]);

  const { hasSufficientBalance, showInsufficientBalance } =
    getOfframpBalanceState(mode, tokenBalance, bestRate?.totalDebit ?? null);

  useEffect(() => {
    let active = true;

    Promise.all([offrampService.getAssets(), offrampService.getCountries()])
      .then(([nextAssets, nextCountries]) => {
        if (!active) return;
        setAssets(nextAssets);
        setCountries(nextCountries);
        setSelectedNetwork((current) => current || nextAssets[0]?.network || "");
        setCountryCode((current) =>
          nextCountries.some((country) => country.code === current)
            ? current
            : nextCountries[0]?.code || "",
        );
        setDiscoveryError(nextAssets.length ? "" : OFFRAMP_MESSAGES.assetsUnavailable);
      })
      .catch((error: Error) => {
        if (active) setDiscoveryError(error.message);
      })
      .finally(() => {
        if (active) setIsLoadingDiscovery(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (mode !== OFFRAMP_MODES.manual || selectedNetwork) return;
    setSelectedNetwork(networks[0] || "");
  }, [mode, networks, selectedNetwork]);

  useEffect(() => {
    if (eligibleAssets.some((asset) => getAssetKey(asset) === selectedAssetKey)) {
      return;
    }
    setSelectedAssetKey(eligibleAssets[0] ? getAssetKey(eligibleAssets[0]) : "");
  }, [eligibleAssets, selectedAssetKey]);

  useEffect(() => {
    if (!selectedCountry) {
      setBanks([]);
      return;
    }

    let active = true;
    setIsLoadingBanks(true);
    setBankCode("");
    setVerifiedAccount(null);
    setAccountError("");

    offrampService
      .getBanks(selectedCountry.code, selectedCountry.currency)
      .then((nextBanks) => {
        if (active) setBanks(nextBanks);
      })
      .catch((error: Error) => {
        if (active) {
          setBanks([]);
          setAccountError(error.message);
        }
      })
      .finally(() => {
        if (active) setIsLoadingBanks(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCountry]);

  useEffect(() => {
    setRates(null);
    setRateError("");

    if (
      !selectedAsset ||
      !selectedCountry ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setIsLoadingRate(false);
      return;
    }

    let active = true;
    const timeout = window.setTimeout(() => {
      setIsLoadingRate(true);
      offrampService
        .getRates(
          {
            token: selectedAsset.symbol,
            tokenAddress: selectedAsset.contractAddress,
            amount: numericAmount,
            country: selectedCountry.code,
            currency: selectedCountry.currency,
            network: selectedAsset.network,
          },
          mode === OFFRAMP_MODES.manual,
        )
        .then((nextRates) => {
          if (!active) return;
          setRates(nextRates);
          if (!nextRates.best) setRateError(OFFRAMP_MESSAGES.ratesUnavailable);
        })
        .catch((error: Error) => {
          if (active) setRateError(error.message);
        })
        .finally(() => {
          if (active) setIsLoadingRate(false);
        });
    }, OFFRAMP_POLLING.rateDebounceMs);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [mode, numericAmount, selectedAsset, selectedCountry]);

  useEffect(() => {
    if (mode === OFFRAMP_MODES.connected && address && selectedAsset) {
      void refetchBalance();
    }
  }, [address, amount, bestRate?.totalDebit, mode, refetchBalance, selectedAsset]);

  useEffect(() => {
    setVerifiedAccount(null);
    setAccountError("");

    if (
      !selectedCountry ||
      !bankCode ||
      accountNumber.length !== 10
    ) {
      setIsVerifyingAccount(false);
      return;
    }

    let active = true;
    const timeout = window.setTimeout(() => {
      setIsVerifyingAccount(true);
      offrampService
        .verifyAccount({
          accountNumber,
          bankCode,
          country: selectedCountry.code,
          currency: selectedCountry.currency,
          providerId: "paycrest",
        })
        .then((account) => {
          if (active) setVerifiedAccount(account);
        })
        .catch((error: Error) => {
          if (active) setAccountError(error.message);
        })
        .finally(() => {
          if (active) setIsVerifyingAccount(false);
        });
    }, OFFRAMP_POLLING.accountDebounceMs);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [accountNumber, bankCode, selectedCountry]);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(OFFRAMP_STORAGE_KEYS.manualOrder);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as StoredManualOfframp;
      if (
        parsed.order?.transactionReference &&
        parsed.order.accessToken &&
        getRemainingSeconds(parsed.order.expiresAt) > 0
      ) {
        setModeState(OFFRAMP_MODES.manual);
        setOrder(parsed.order);
        setAccessToken(parsed.order.accessToken);
        setPublicStatus({
          transactionReference: parsed.order.transactionReference,
          status: "pending",
          stage: OFFRAMP_PUBLIC_STAGES.awaitingDeposit,
          expiresAt: parsed.order.expiresAt || null,
        });
      } else {
        window.sessionStorage.removeItem(OFFRAMP_STORAGE_KEYS.manualOrder);
      }
    } catch {
      window.sessionStorage.removeItem(OFFRAMP_STORAGE_KEYS.manualOrder);
    }
  }, []);

  useEffect(() => {
    if (!order?.expiresAt || isTerminalOfframpStatus(publicStatus?.status || "")) {
      setRemainingSeconds(order?.expiresAt ? getRemainingSeconds(order.expiresAt) : 0);
      return;
    }

    const updateCountdown = () => {
      const remaining = getRemainingSeconds(order.expiresAt);
      setRemainingSeconds(remaining);
      if (remaining === 0) {
        setPublicStatus({
          transactionReference: order.transactionReference,
          status: "expired",
          stage: OFFRAMP_PUBLIC_STAGES.expired,
          expiresAt: order.expiresAt || null,
        });
        window.sessionStorage.removeItem(OFFRAMP_STORAGE_KEYS.manualOrder);
      }
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1_000);
    return () => window.clearInterval(interval);
  }, [order, publicStatus?.status]);

  useEffect(() => {
    if (
      !order ||
      isTerminalOfframpStatus(publicStatus?.status || "") ||
      (mode === OFFRAMP_MODES.manual && !accessToken) ||
      (mode === OFFRAMP_MODES.connected && !address)
    ) {
      return;
    }

    let active = true;
    let timeout: number | undefined;
    const startedAt = Date.now();

    const poll = async () => {
      try {
        const nextStatus =
          mode === OFFRAMP_MODES.manual
            ? await offrampService.getManualStatus(
                order.transactionReference,
                accessToken,
              )
            : await offrampService.getConnectedStatus(
                order.transactionReference,
                address!,
              );
        if (!active) return;
        setPublicStatus(nextStatus);
        setStatusError("");

        if (isTerminalOfframpStatus(nextStatus.status)) {
          window.sessionStorage.removeItem(OFFRAMP_STORAGE_KEYS.manualOrder);
          return;
        }
      } catch (error) {
        if (active) setStatusError((error as Error).message);
      }

      if (active) {
        timeout = window.setTimeout(
          poll,
          getPollingInterval(Date.now() - startedAt),
        );
      }
    };

    timeout = window.setTimeout(poll, OFFRAMP_POLLING.fastIntervalMs);

    return () => {
      active = false;
      if (timeout) window.clearTimeout(timeout);
    };
  }, [accessToken, address, mode, order, publicStatus?.status]);

  const sendConnectedDeposit = useCallback(
    async (activeOrder: OfframpOrder) => {
      if (!selectedAsset) return;
      setIsSendingDeposit(true);
      setActionError("");

      try {
        const units = parseUnits(
          activeOrder.depositAmount.toFixed(selectedAsset.decimals),
          selectedAsset.decimals,
        );
        const hash = await writeContractAsync({
          abi: ERC20_OFFRAMP_ABI,
          address: selectedAsset.contractAddress,
          functionName: "transfer",
          args: [activeOrder.depositAddress, units],
          chainId: selectedAsset.chainId,
        });
        setTxHash(hash);
        await waitForTransactionReceipt(config, { hash });
      } catch (error) {
        setActionError(
          isWalletRejection(error)
            ? OFFRAMP_MESSAGES.walletRejected
            : OFFRAMP_MESSAGES.transferFailed,
        );
      } finally {
        setIsSendingDeposit(false);
      }
    },
    [selectedAsset, writeContractAsync],
  );

  const createOrder = useCallback(async () => {
    if (!selectedAsset || !selectedCountry || !verifiedAccount || !bestRate) {
      return;
    }
    if (mode === OFFRAMP_MODES.connected && !address) {
      connect();
      return;
    }

    setIsCreatingOrder(true);
    setActionError("");

    const params = {
      token: selectedAsset.symbol,
      tokenAddress: selectedAsset.contractAddress,
      amount: numericAmount,
      country: selectedCountry.code,
      currency: selectedCountry.currency,
      network: selectedAsset.network,
      bankCode,
      accountNumber,
      accountName: verifiedAccount.accountName,
      ...(email.trim() ? { email: email.trim() } : {}),
    };

    try {
      if (mode === OFFRAMP_MODES.manual) {
        const created = await offrampService.createManual(params);
        const walletlessOrder = normalizeManualOfframpOrder(
          created,
          numericAmount,
        );
        setOrder(walletlessOrder);
        setAccessToken(walletlessOrder.accessToken);
        setPublicStatus({
          transactionReference: walletlessOrder.transactionReference,
          status: "pending",
          stage: OFFRAMP_PUBLIC_STAGES.awaitingDeposit,
          expiresAt: walletlessOrder.expiresAt || null,
        });
        const stored: StoredManualOfframp = {
          order: walletlessOrder,
          savedAt: Date.now(),
        };
        window.sessionStorage.setItem(
          OFFRAMP_STORAGE_KEYS.manualOrder,
          JSON.stringify(stored),
        );
      } else {
        const created = await offrampService.createConnected(params, address!);
        setOrder(created);
        setPublicStatus({
          transactionReference: created.transactionReference,
          status: "pending",
          stage: OFFRAMP_PUBLIC_STAGES.awaitingDeposit,
          expiresAt: created.expiresAt || null,
        });
        await sendConnectedDeposit(created);
      }
    } catch (error) {
      setActionError((error as Error).message);
    } finally {
      setIsCreatingOrder(false);
    }
  }, [
    accountNumber,
    address,
    bankCode,
    bestRate,
    connect,
    email,
    mode,
    numericAmount,
    selectedAsset,
    selectedCountry,
    sendConnectedDeposit,
    verifiedAccount,
  ]);

  const confirmManualDeposit = useCallback(async () => {
    if (!order || !accessToken) return;
    setIsConfirmingDeposit(true);
    setStatusError("");
    try {
      const nextStatus = await offrampService.confirmManualDeposit(
        order.transactionReference,
        accessToken,
      );
      setPublicStatus(nextStatus);
    } catch (error) {
      setStatusError((error as Error).message);
    } finally {
      setIsConfirmingDeposit(false);
    }
  }, [accessToken, order]);

  const resetOrder = useCallback(() => {
    setOrder(null);
    setAccessToken("");
    setPublicStatus(null);
    setTxHash(null);
    setActionError("");
    setStatusError("");
    window.sessionStorage.removeItem(OFFRAMP_STORAGE_KEYS.manualOrder);
  }, []);

  const setMode = useCallback(
    (nextMode: OfframpMode) => {
      if (order) return;
      setModeState(nextMode);
      setRates(null);
      setRateError("");
      setActionError("");
    },
    [order],
  );

  const canCreateOrder = Boolean(
    selectedAsset &&
      selectedCountry &&
      verifiedAccount &&
      bestRate &&
      numericAmount > 0 &&
      hasSufficientBalance &&
      !isLoadingRate &&
      !isVerifyingAccount &&
      (mode === OFFRAMP_MODES.manual || (isConnected && hasSupportedConnectedNetwork)),
  );

  return {
    accountError,
    accountNumber,
    actionError,
    address,
    amount,
    assets: eligibleAssets,
    bankCode,
    banks,
    bestRate,
    canCreateOrder,
    chainId,
    confirmManualDeposit,
    connect,
    countries,
    countryCode,
    createOrder,
    discoveryError,
    email,
    hasSufficientBalance,
    hasSupportedConnectedNetwork,
    isConfirmingDeposit,
    isConnected,
    isCreatingOrder,
    isLoadingBanks,
    isLoadingDiscovery,
    isLoadingRate,
    isSendingDeposit,
    isVerifyingAccount,
    mode,
    networks,
    order,
    publicStatus,
    rateError,
    remainingSeconds,
    resetOrder,
    selectedAsset,
    selectedAssetKey,
    selectedCountry,
    selectedNetwork,
    sendConnectedDeposit,
    setAccountNumber,
    setAmount,
    setBankCode,
    setCountryCode,
    setEmail,
    setMode,
    setSelectedAssetKey,
    setSelectedNetwork,
    showInsufficientBalance,
    statusError,
    switchNetwork,
    tokenBalance,
    txHash,
    verifiedAccount,
  };
}
