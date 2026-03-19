"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type { OfframpFormState, OfframpToken, OfframpCountry, CountryInfo } from "@/types/offramp";
import { SUPPORTED_OFFRAMP_TOKENS } from "@/types/offramp";

interface OfframpFormProps {
    formState: OfframpFormState;
    onChange: (field: keyof OfframpFormState, value: string) => void;
    countries: CountryInfo[];
    isLoadingCountries?: boolean;
    maxBalance?: string;
    onMaxClick?: () => void;
}

export function OfframpForm({ formState, onChange, countries, isLoadingCountries, maxBalance, onMaxClick }: OfframpFormProps) {
    return (
        <div className="bg-fundable-mid-dark rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-syne font-semibold text-white mb-6">
                Crypto Token
            </h2>

            {/* Token Selector */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="token" className="text-fundable-light-grey text-sm">Select Token</Label>
                    <Select
                        value={formState.token}
                        onValueChange={(value) => onChange("token", value as OfframpToken)}
                    >
                        <SelectTrigger id="token" className="bg-fundable-dark border-gray-700 text-white h-12">
                            <SelectValue placeholder="Select token" />
                        </SelectTrigger>
                        <SelectContent className="bg-fundable-dark border-gray-700">
                            {SUPPORTED_OFFRAMP_TOKENS.map((token) => (
                                <SelectItem
                                    key={token.symbol}
                                    value={token.symbol}
                                    className="text-white hover:bg-fundable-violet focus:bg-fundable-violet"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{token.symbol}</span>
                                        <span className="text-fundable-light-grey text-sm">
                                            ({token.name})
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                    <Label htmlFor="amount" className="text-fundable-light-grey text-sm">Amount</Label>
                    <div className="relative">
                        <Input
                            id="amount"
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={formState.amount}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9.]/g, "");
                                if (val.split(".").length <= 2) onChange("amount", val);
                            }}
                            className="bg-fundable-dark border-gray-700 text-white h-12 pr-16"
                        />
                        <button
                            type="button"
                            onClick={onMaxClick}
                            disabled={!maxBalance || !onMaxClick}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-fundable-purple text-sm font-medium hover:text-fundable-violet disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Max
                        </button>
                    </div>
                </div>

                {/* Destination Country */}
                <div className="space-y-2">
                    <Label htmlFor="country" className="text-fundable-light-grey text-sm">
                        Destination Country
                    </Label>
                    <Select
                        value={formState.country}
                        onValueChange={(value) => onChange("country", value as OfframpCountry)}
                    >
                        <SelectTrigger id="country" className="bg-fundable-dark border-gray-700 text-white h-12">
                            <SelectValue placeholder={isLoadingCountries ? "Loading countries..." : "Select country"} />
                        </SelectTrigger>
                        <SelectContent className="bg-fundable-dark border-gray-700">
                            {countries.map((country) => (
                                <SelectItem
                                    key={country.code}
                                    value={country.code}
                                    className="text-white hover:bg-fundable-violet focus:bg-fundable-violet"
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{country.flag}</span>
                                        <span>{country.name}</span>
                                        <span className="text-fundable-light-grey">
                                            ({country.currency})
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Email Notification (Optional) */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-fundable-light-grey text-sm">
                        Email for Notifications{" "}
                        <span className="text-gray-500 text-xs">(optional)</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formState.email}
                        onChange={(e) => onChange("email", e.target.value)}
                        className="bg-fundable-dark border-gray-700 text-white h-12"
                    />
                    <p className="text-gray-500 text-xs">
                        Get notified when your payout arrives in your bank account.
                    </p>
                </div>
            </div>
        </div>
    );
}
