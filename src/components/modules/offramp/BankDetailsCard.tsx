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
import { Loader2, CheckCircle2 } from "lucide-react";

import type { OfframpFormState, Bank } from "@/types/offramp";

interface BankDetailsCardProps {
    formState: OfframpFormState;
    banks: Bank[];
    isLoadingBanks: boolean;
    isVerifyingAccount: boolean;
    onChange: (field: keyof OfframpFormState, value: string) => void;
}

export default function BankDetailsCard({
    formState,
    banks,
    isLoadingBanks,
    isVerifyingAccount,
    onChange,
}: BankDetailsCardProps) {
    return (
        <div className="bg-fundable-mid-dark rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-syne font-semibold text-white mb-6">
                Bank Details
            </h2>

            <div className="space-y-4">
                {/* Bank Selector */}
                <div className="space-y-2">
                    <Label className="text-fundable-light-grey text-sm">Bank Name</Label>
                    <Select
                        value={formState.bankCode}
                        onValueChange={(value) => onChange("bankCode", value)}
                        disabled={isLoadingBanks}
                    >
                        <SelectTrigger className="bg-fundable-dark border-gray-700 text-white h-12">
                            {isLoadingBanks ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Loading banks...</span>
                                </div>
                            ) : (
                                <SelectValue placeholder="Select bank" />
                            )}
                        </SelectTrigger>
                        <SelectContent className="bg-fundable-dark border-gray-700 max-h-60">
                            {banks.map((bank) => (
                                <SelectItem
                                    key={bank.code}
                                    value={bank.code}
                                    className="text-white hover:bg-fundable-violet focus:bg-fundable-violet"
                                >
                                    {bank.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Account Number */}
                <div className="space-y-2">
                    <Label className="text-fundable-light-grey text-sm">
                        Account Number
                    </Label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Enter account number"
                            value={formState.accountNumber}
                            onChange={(e) => {
                                // Only allow numbers and max 10 digits
                                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                                onChange("accountNumber", value);
                            }}
                            className="bg-fundable-dark border-gray-700 text-white h-12"
                            maxLength={10}
                        />
                        {isVerifyingAccount && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-fundable-purple" />
                        )}
                    </div>
                </div>

                {/* Account Name (auto-filled) */}
                <div className="space-y-2">
                    <Label className="text-fundable-light-grey text-sm">
                        Account Name
                    </Label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Account name will appear here"
                            value={formState.accountName}
                            readOnly
                            className="bg-fundable-dark border-gray-700 text-white h-12 pr-10"
                        />
                        {formState.accountName && (
                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                    </div>
                    {formState.accountName && (
                        <p className="text-green-500 text-xs">Account verified ✓</p>
                    )}
                </div>
            </div>
        </div>
    );
}
