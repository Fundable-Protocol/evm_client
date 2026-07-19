"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Copy,
  ExternalLink,
  LoaderCircle,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BankCombobox } from "@/components/modules/offramp/BankCombobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOfframpFlow } from "@/hooks/useOfframpFlow";
import {
  OFFRAMP_CHAIN_NAMES,
  OFFRAMP_MESSAGES,
} from "@/lib/offramp/offramp.constants";
import {
  calculateFeeAdjustedRate,
  formatCountdown,
  formatOfframpAmount,
  isTerminalOfframpStatus,
  shortenAddress,
} from "@/lib/offramp/offramp.utils";
import {
  OFFRAMP_MODES,
  OFFRAMP_PUBLIC_STAGES,
  type OfframpAsset,
  type OfframpMode,
  type OfframpPublicStage,
} from "@/types/offramp";

const assetKey = (asset: OfframpAsset) =>
  `${asset.network}:${asset.contractAddress.toLowerCase()}`;

function FieldMessage({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-xs leading-5 text-rose-300">{children}</p>;
}

function LoadingLabel({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-gray-400">
      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      {label}
    </span>
  );
}

function ModeSelector({
  mode,
  onChange,
}: {
  mode: OfframpMode;
  onChange: (mode: OfframpMode) => void;
}) {
  return (
    <div
      className="grid grid-cols-2 rounded-md border border-gray-700 bg-black/20 p-1"
      role="tablist"
      aria-label="Transfer method"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === OFFRAMP_MODES.connected}
        onClick={() => onChange(OFFRAMP_MODES.connected)}
        className={`flex min-h-11 items-center justify-center gap-2 rounded px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fundable-purple-2 ${
          mode === OFFRAMP_MODES.connected
            ? "bg-fundable-purple-2 text-black"
            : "text-gray-300 hover:bg-white/5"
        }`}
      >
        <Wallet className="size-4" aria-hidden="true" />
        Connected wallet
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === OFFRAMP_MODES.manual}
        onClick={() => onChange(OFFRAMP_MODES.manual)}
        className={`flex min-h-11 items-center justify-center gap-2 rounded px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fundable-purple-2 ${
          mode === OFFRAMP_MODES.manual
            ? "bg-fundable-purple-2 text-black"
            : "text-gray-300 hover:bg-white/5"
        }`}
      >
        <ArrowDownToLine className="size-4" aria-hidden="true" />
        Send manually
      </button>
    </div>
  );
}

function QuoteSummary({
  mode,
  rate,
}: {
  mode: OfframpMode;
  rate: NonNullable<ReturnType<typeof useOfframpFlow>["bestRate"]>;
}) {
  const debit = rate.totalDebit;
  const displayRate =
    mode === OFFRAMP_MODES.manual
      ? calculateFeeAdjustedRate(rate.rate, rate.fundableFeePercent ?? 0)
      : rate.rate;
  const bankReceives =
    mode === OFFRAMP_MODES.manual
      ? debit * displayRate
      : rate.fiatAmount;

  return (
    <section className="border-t border-gray-700 pt-6" aria-labelledby="quote-heading">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 id="quote-heading" className="font-syne text-lg font-medium">
            Quote summary
          </h2>
          <p className="mt-1 text-sm text-gray-400">Live rate</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Best available rate
        </span>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="text-xs text-gray-500">You send</dt>
          <dd className="mt-1 text-base font-medium text-white">
            {formatOfframpAmount(debit, 6)} {rate.token}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Exchange rate</dt>
          <dd className="mt-1 text-base font-medium text-white">
            1 {rate.token} = {formatOfframpAmount(displayRate)} {rate.currency}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Bank receives</dt>
          <dd className="mt-1 text-base font-medium text-emerald-300">
            {formatOfframpAmount(bankReceives)} {rate.currency}
          </dd>
        </div>
      </dl>
    </section>
  );
}

const timelineSteps = [
  {
    title: "Deposit ready",
    description: "Send the exact token amount to the deposit address",
  },
  {
    title: "Deposit confirmed",
    description: "The token transfer has been detected on-chain",
  },
  {
    title: "Bank payout",
    description: "Your bank payment is being processed",
  },
  {
    title: "Completed",
    description: "The payout has arrived at the destination bank",
  },
] as const;

const stageProgress: Record<OfframpPublicStage, number> = {
  [OFFRAMP_PUBLIC_STAGES.awaitingDeposit]: 0,
  [OFFRAMP_PUBLIC_STAGES.depositConfirmed]: 1,
  [OFFRAMP_PUBLIC_STAGES.bankPayout]: 2,
  [OFFRAMP_PUBLIC_STAGES.completed]: 3,
  [OFFRAMP_PUBLIC_STAGES.refundProcessing]: 2,
  [OFFRAMP_PUBLIC_STAGES.refunded]: 3,
  [OFFRAMP_PUBLIC_STAGES.expired]: 0,
};

function StatusTimeline({
  stage,
  isTerminal,
}: {
  stage: OfframpPublicStage;
  isTerminal: boolean;
}) {
  const progress = stageProgress[stage] ?? 0;
  const isFailure =
    stage === OFFRAMP_PUBLIC_STAGES.refunded ||
    stage === OFFRAMP_PUBLIC_STAGES.expired;

  return (
    <ol className="mt-7 space-y-0" aria-label="Offramp progress">
      {timelineSteps.map((step, index) => {
        const isComplete = !isFailure && index < progress;
        const isCurrent = index === progress && !isTerminal;
        const finalComplete = index === 3 && stage === OFFRAMP_PUBLIC_STAGES.completed;
        const highlighted = isComplete || isCurrent || finalComplete;

        return (
          <li key={step.title} className="grid grid-cols-[32px_1fr] gap-4">
            <div className="flex min-h-20 flex-col items-center">
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full border ${
                  isComplete || finalComplete
                    ? "border-emerald-400 bg-emerald-500/15 text-emerald-300"
                    : isCurrent
                      ? "border-fundable-purple-2 bg-fundable-purple-2/15 text-fundable-purple-2"
                      : "border-gray-700 bg-black/20 text-gray-600"
                }`}
              >
                {isComplete || finalComplete ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : isCurrent ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Circle className="size-2 fill-current" aria-hidden="true" />
                )}
              </span>
              {index < timelineSteps.length - 1 ? (
                <span
                  className={`h-12 w-px ${
                    index < progress && !isFailure ? "bg-emerald-500/50" : "bg-gray-800"
                  }`}
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <div className="min-w-0 pb-7 pt-1">
              <p className={`font-medium ${highlighted ? "text-white" : "text-gray-600"}`}>
                {step.title}
              </p>
              <p className={`mt-1 text-sm leading-5 ${highlighted ? "text-gray-400" : "text-gray-700"}`}>
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function CopyValue({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      title={`Copy ${label}`}
      aria-label={`Copy ${label}`}
      onClick={copy}
      className="rounded-md border-gray-700 bg-black/20 text-white hover:bg-white/10"
    >
      {copied ? <Check className="text-emerald-300" /> : <Copy />}
    </Button>
  );
}

function OrderProgress({ flow }: { flow: ReturnType<typeof useOfframpFlow> }) {
  const { order, publicStatus } = flow;
  if (!order || !publicStatus) return null;

  const isTerminal = isTerminalOfframpStatus(publicStatus.status);
  const isCompleted = publicStatus.stage === OFFRAMP_PUBLIC_STAGES.completed;
  const isRefund =
    publicStatus.stage === OFFRAMP_PUBLIC_STAGES.refundProcessing ||
    publicStatus.stage === OFFRAMP_PUBLIC_STAGES.refunded;
  const isRefunded = publicStatus.stage === OFFRAMP_PUBLIC_STAGES.refunded;
  const statusLabel = isCompleted
    ? "Completed"
    : publicStatus.stage === OFFRAMP_PUBLIC_STAGES.expired
      ? "Expired"
      : isRefunded
        ? "Refunded"
        : isRefund
        ? "Refund in progress"
        : "In progress";

  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="flex flex-col gap-4 border-b border-gray-700 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500">Transfer reference</p>
          <h2 className="mt-2 break-all font-mono text-lg font-medium text-white">
            {order.transactionReference}
          </h2>
        </div>
        <span
          className={`inline-flex w-fit items-center gap-2 rounded border px-3 py-2 text-xs font-medium ${
            isCompleted
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : isTerminal || isRefund
                ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                : "border-fundable-purple-2/40 bg-fundable-purple-2/10 text-violet-200"
          }`}
        >
          {isCompleted ? <CheckCircle2 className="size-4" /> : <Clock3 className="size-4" />}
          {statusLabel}
        </span>
      </header>

      {!isTerminal ? (
        <section className="mt-6 border-b border-gray-700 pb-7" aria-labelledby="deposit-heading">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-200">
                <AlertTriangle className="size-5" aria-hidden="true" />
                <h3 id="deposit-heading" className="font-syne text-lg font-medium">
                  {flow.mode === OFFRAMP_MODES.manual
                    ? "Send from your external wallet"
                    : "Token deposit"}
                </h3>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                {flow.mode === OFFRAMP_MODES.manual
                  ? "Your wallet is not connected here. Copy this address into your exchange or wallet and send the exact amount on the selected network."
                  : "The connected wallet will send the exact token amount to the deposit address."}
              </p>
            </div>
            {order.expiresAt ? (
              <div className="shrink-0 rounded-md border border-amber-400/30 bg-amber-400/10 px-4 py-3">
                <p className="text-xs text-amber-200/70">Address expires in</p>
                <p className="mt-1 font-mono text-xl font-medium text-amber-200">
                  {formatCountdown(flow.remainingSeconds)}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="min-w-0 rounded-md border border-gray-700 bg-black/20 p-4">
              <p className="text-xs text-gray-500">Deposit address</p>
              <div className="mt-2 flex items-center gap-3">
                <code className="min-w-0 flex-1 break-all text-sm leading-6 text-white">
                  {order.depositAddress}
                </code>
                <CopyValue value={order.depositAddress} label="deposit address" />
              </div>
            </div>
            <div className="rounded-md border border-gray-700 bg-black/20 p-4">
              <p className="text-xs text-gray-500">Send exactly</p>
              <p className="mt-2 text-xl font-medium text-white">
                {formatOfframpAmount(order.depositAmount, 6)} {order.depositToken}
              </p>
              <p className="mt-1 text-xs text-gray-400">on {order.depositNetwork}</p>
            </div>
          </div>

          {flow.mode === OFFRAMP_MODES.manual ? (
            <Button
              type="button"
              variant="gradient"
              size="lg"
              onClick={flow.confirmManualDeposit}
              disabled={flow.isConfirmingDeposit}
              className="mt-5 w-full rounded-md sm:w-auto"
            >
              {flow.isConfirmingDeposit ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <RefreshCw />
              )}
              I have sent the funds
            </Button>
          ) : null}
        </section>
      ) : null}

      <StatusTimeline stage={publicStatus.stage} isTerminal={isTerminal} />

      {flow.txHash ? (
        <div className="flex min-w-0 items-center gap-3 rounded-md border border-gray-700 bg-black/20 p-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500">Wallet transaction</p>
            <p className="mt-1 truncate font-mono text-sm text-white">{flow.txHash}</p>
          </div>
          <ExternalLink className="size-4 shrink-0 text-gray-400" aria-hidden="true" />
        </div>
      ) : null}

      {flow.actionError ? (
        <div className="mt-5 rounded-md border border-rose-500/30 bg-rose-500/10 p-4 text-sm leading-6 text-rose-200">
          {flow.actionError}
          {flow.mode === OFFRAMP_MODES.connected && !isTerminal ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => flow.sendConnectedDeposit(order)}
              disabled={flow.isSendingDeposit}
              className="mt-3 rounded-md border-rose-300/30 bg-transparent text-white"
            >
              <RefreshCw className={flow.isSendingDeposit ? "animate-spin" : ""} />
              Retry wallet transfer
            </Button>
          ) : null}
        </div>
      ) : null}

      {flow.statusError ? (
        <p className="mt-4 text-sm leading-6 text-amber-200">{flow.statusError}</p>
      ) : null}

      {isTerminal ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={flow.resetOrder}
          className="mt-7 w-full rounded-md border-gray-700 bg-transparent text-white hover:bg-white/10 sm:w-auto"
        >
          <RotateCcw />
          Start another transfer
        </Button>
      ) : null}
    </div>
  );
}

export default function OfframpExperience() {
  const flow = useOfframpFlow();

  const currentNetworkName = useMemo(() => {
    if (!flow.chainId) return "Not connected";
    return (
      OFFRAMP_CHAIN_NAMES[
        flow.chainId as keyof typeof OFFRAMP_CHAIN_NAMES
      ] || `Chain ${flow.chainId}`
    );
  }, [flow.chainId]);

  if (flow.isRestoringOrder) {
    return (
      <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-gray-400">
        <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
        Restoring your transfer
      </div>
    );
  }

  if (flow.order) return <OrderProgress flow={flow} />;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex flex-col gap-5 border-b border-gray-700 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-gray-400">Withdraw USDC or USDT to a bank account.</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="size-4 text-emerald-400" aria-hidden="true" />
            Deposit and bank payout updates are tracked automatically
          </div>
        </div>
        <div className="w-full lg:w-[430px]">
          <ModeSelector mode={flow.mode} onChange={flow.setMode} />
        </div>
      </div>

      {flow.discoveryError ? (
        <div className="mt-6 rounded-md border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          {flow.discoveryError}
        </div>
      ) : null}

      {flow.mode === OFFRAMP_MODES.manual ? (
        <div className="mt-6 flex gap-3 rounded-md border border-amber-400/30 bg-amber-400/10 p-4 text-amber-100">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-medium">No wallet is connected to this transfer</p>
            <p className="mt-1 text-sm leading-6 text-amber-100/70">
              Continue to generate a deposit address, then send the exact amount before the transfer window expires.
            </p>
          </div>
        </div>
      ) : !flow.isConnected ? (
        <div className="mt-6 flex flex-col gap-4 rounded-md border border-fundable-purple-2/40 bg-fundable-purple-2/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-white">Connect your wallet</p>
            <p className="mt-1 text-sm text-gray-400">Available tokens for your current network will appear after you connect.</p>
          </div>
          <Button type="button" variant="gradient" size="md" onClick={flow.connect} className="rounded-md">
            <Wallet />
            Connect wallet
          </Button>
        </div>
      ) : !flow.hasSupportedConnectedNetwork && !flow.isLoadingDiscovery ? (
        <div className="mt-6 flex flex-col gap-4 rounded-md border border-amber-400/30 bg-amber-400/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-amber-100">{currentNetworkName} is not supported</p>
            <p className="mt-1 text-sm text-amber-100/70">Switch to Ethereum, BNB Smart Chain, Polygon, Arbitrum, Base, or Lisk.</p>
          </div>
          <Button type="button" variant="outline" size="md" onClick={flow.switchNetwork} className="rounded-md border-amber-200/30 bg-transparent text-white">
            Switch network
          </Button>
        </div>
      ) : null}

      <div className="grid gap-x-10 gap-y-8 py-7 lg:grid-cols-2">
        <section aria-labelledby="transfer-details-heading">
          <h2 id="transfer-details-heading" className="font-syne text-lg font-medium">Transfer details</h2>
          <div className="mt-5 space-y-5">
            {flow.mode === OFFRAMP_MODES.manual ? (
              <div>
                <Label htmlFor="offramp-network" className="text-sm text-gray-300">Network</Label>
                <Select value={flow.selectedNetwork} onValueChange={flow.setSelectedNetwork} disabled={flow.isLoadingDiscovery}>
                  <SelectTrigger id="offramp-network" className="mt-2 w-full border-gray-700 bg-black/20 text-white">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    {flow.networks.map((network) => (
                      <SelectItem key={network} value={network}>{network}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="rounded-md border border-gray-700 bg-black/20 p-4">
                <p className="text-xs text-gray-500">Connected network</p>
                <p className="mt-1 font-medium text-white">{currentNetworkName}</p>
                {flow.address ? <p className="mt-1 font-mono text-xs text-gray-500">{shortenAddress(flow.address)}</p> : null}
              </div>
            )}

            <div>
              <Label htmlFor="offramp-token" className="text-sm text-gray-300">Token</Label>
              <Select value={flow.selectedAssetKey} onValueChange={flow.setSelectedAssetKey} disabled={!flow.assets.length}>
                <SelectTrigger id="offramp-token" className="mt-2 w-full border-gray-700 bg-black/20 text-white">
                  <SelectValue placeholder={flow.isLoadingDiscovery ? "Loading tokens" : "Select token"} />
                </SelectTrigger>
                <SelectContent>
                  {flow.assets.map((asset) => (
                    <SelectItem key={assetKey(asset)} value={assetKey(asset)}>
                      {asset.symbol} on {OFFRAMP_CHAIN_NAMES[asset.chainId as keyof typeof OFFRAMP_CHAIN_NAMES] || asset.network}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="offramp-amount" className="text-sm text-gray-300">Amount</Label>
                {flow.mode === OFFRAMP_MODES.connected && flow.tokenBalance !== null && flow.selectedAsset ? (
                  <span className="text-xs text-gray-500">Balance: {formatOfframpAmount(flow.tokenBalance, 6)} {flow.selectedAsset.symbol}</span>
                ) : null}
              </div>
              <div className="relative mt-2">
                <Input
                  id="offramp-amount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={flow.amount}
                  onChange={(event) => flow.setAmount(event.target.value)}
                  placeholder="0.00"
                  className="h-12 border-gray-700 bg-black/20 pr-20 text-lg text-white placeholder:text-gray-600"
                />
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-gray-400">{flow.selectedAsset?.symbol || "TOKEN"}</span>
              </div>
              {flow.isLoadingRate ? <div className="mt-2"><LoadingLabel label="Refreshing rate" /></div> : null}
              {flow.rateError ? <FieldMessage>{flow.rateError}</FieldMessage> : null}
              {flow.showInsufficientBalance ? <FieldMessage>{OFFRAMP_MESSAGES.insufficientBalance}</FieldMessage> : null}
            </div>

            <div>
              <Label htmlFor="offramp-country" className="text-sm text-gray-300">Destination country</Label>
              <Select value={flow.countryCode} onValueChange={flow.setCountryCode} disabled={!flow.countries.length}>
                <SelectTrigger id="offramp-country" className="mt-2 w-full border-gray-700 bg-black/20 text-white">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {flow.countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>{country.flag} {country.name} ({country.currency})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section aria-labelledby="bank-details-heading" className="border-t border-gray-700 pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h2 id="bank-details-heading" className="font-syne text-lg font-medium">Bank details</h2>
          <div className="mt-5 space-y-5">
            <div>
              <Label htmlFor="offramp-bank" className="text-sm text-gray-300">Bank</Label>
              <BankCombobox
                banks={flow.banks}
                value={flow.bankCode}
                onValueChange={flow.setBankCode}
                isLoading={flow.isLoadingBanks}
                disabled={flow.isLoadingBanks || !flow.banks.length}
              />
            </div>

            <div>
              <Label htmlFor="offramp-account" className="text-sm text-gray-300">Account number</Label>
              <Input
                id="offramp-account"
                inputMode="numeric"
                maxLength={10}
                value={flow.accountNumber}
                onChange={(event) => flow.setAccountNumber(event.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit account number"
                className="mt-2 h-12 border-gray-700 bg-black/20 text-white placeholder:text-gray-600"
              />
              {flow.isVerifyingAccount ? <div className="mt-2"><LoadingLabel label="Verifying account" /></div> : null}
              {flow.accountError ? <FieldMessage>{flow.accountError}</FieldMessage> : null}
            </div>

            <div>
              <Label htmlFor="offramp-account-name" className="text-sm text-gray-300">Account name</Label>
              <div className="relative mt-2">
                <Input
                  id="offramp-account-name"
                  readOnly
                  value={flow.verifiedAccount?.accountName || ""}
                  placeholder="Verified account name"
                  className="h-12 border-gray-700 bg-black/20 pr-12 text-white placeholder:text-gray-600"
                />
                {flow.verifiedAccount ? <CheckCircle2 className="absolute right-4 top-3.5 size-5 text-emerald-400" aria-label="Account verified" /> : null}
              </div>
            </div>

            <div>
              <Label htmlFor="offramp-email" className="text-sm text-gray-300">Email <span className="text-gray-600">(optional)</span></Label>
              <Input
                id="offramp-email"
                type="email"
                value={flow.email}
                onChange={(event) => flow.setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 h-12 border-gray-700 bg-black/20 text-white placeholder:text-gray-600"
              />
            </div>
          </div>
        </section>
      </div>

      {flow.bestRate ? <QuoteSummary mode={flow.mode} rate={flow.bestRate} /> : null}

      {flow.actionError ? <div className="mt-5 rounded-md border border-rose-500/30 bg-rose-500/10 p-4 text-sm leading-6 text-rose-200">{flow.actionError}</div> : null}

      <div className="mt-7 flex justify-end border-t border-gray-700 pt-6">
        <Button
          type="button"
          variant="gradient"
          size="lg"
          onClick={flow.mode === OFFRAMP_MODES.connected && !flow.isConnected ? flow.connect : flow.createOrder}
          disabled={flow.mode === OFFRAMP_MODES.connected && !flow.isConnected ? false : !flow.canCreateOrder || flow.isCreatingOrder || flow.isSendingDeposit}
          className="w-full rounded-md sm:w-auto sm:min-w-56"
        >
          {flow.isCreatingOrder || flow.isSendingDeposit ? <LoaderCircle className="animate-spin" /> : flow.mode === OFFRAMP_MODES.connected ? <Wallet /> : <ArrowDownToLine />}
          {flow.mode === OFFRAMP_MODES.connected && !flow.isConnected
            ? "Connect wallet"
            : flow.isCreatingOrder
              ? "Creating transfer"
              : flow.isSendingDeposit
                ? "Confirm in wallet"
                : flow.mode === OFFRAMP_MODES.manual
                  ? "Create deposit address"
                  : "Start bank transfer"}
        </Button>
      </div>
    </div>
  );
}
