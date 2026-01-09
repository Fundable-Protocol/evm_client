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

import type { OfframpFormState, OfframpToken, OfframpCountry } from "@/types/offramp";
import { SUPPORTED_COUNTRIES, SUPPORTED_OFFRAMP_TOKENS } from "@/types/offramp";

interface OfframpFormProps {
    formState: OfframpFormState;
    onChange: (field: keyof OfframpFormState, value: string) => void;
}

export default function OfframpForm({ formState, onChange }: OfframpFormProps) {
    const selectedCountry = SUPPORTED_COUNTRIES.find(
        (c) => c.code === formState.country
    );

    return (
        <div className="bg-fundable-mid-dark rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-syne font-semibold text-white mb-6">
                Crypto Token
            </h2>

            {/* Token Selector */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-fundable-light-grey text-sm">Select Token</Label>
                    <Select
                        value={formState.token}
                        onValueChange={(value) => onChange("token", value as OfframpToken)}
                    >
                        <SelectTrigger className="bg-fundable-dark border-gray-700 text-white h-12">
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
                    <Label className="text-fundable-light-grey text-sm">Amount</Label>
                    <div className="relative">
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={formState.amount}
                            onChange={(e) => onChange("amount", e.target.value)}
                            className="bg-fundable-dark border-gray-700 text-white h-12 pr-16"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-fundable-purple text-sm font-medium hover:text-fundable-violet"
                        >
                            Max
                        </button>
                    </div>
                </div>

                {/* Exchange Rate Display */}
                <div className="bg-fundable-dark rounded-lg p-4 border border-gray-800">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-fundable-light-grey">Current Exchange Rate</span>
                        <span className="text-fundable-purple">↗</span>
                    </div>
                    <p className="text-white text-sm mt-1">
                        1 {formState.token} ≈ {selectedCountry?.currency || "---"} (Live rate)
                    </p>
                    <p className="text-fundable-light-grey text-xs mt-1">
                        Updated in real-time
                    </p>
                </div>

                {/* Destination Country */}
                <div className="space-y-2">
                    <Label className="text-fundable-light-grey text-sm">
                        Destination Country
                    </Label>
                    <Select
                        value={formState.country}
                        onValueChange={(value) => onChange("country", value as OfframpCountry)}
                    >
                        <SelectTrigger className="bg-fundable-dark border-gray-700 text-white h-12">
                            <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="bg-fundable-dark border-gray-700">
                            {SUPPORTED_COUNTRIES.map((country) => (
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
            </div>
        </div>
    );
}
