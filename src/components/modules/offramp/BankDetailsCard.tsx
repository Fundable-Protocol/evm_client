"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, ChevronDown, Search, X } from "lucide-react";

import type { OfframpFormState, Bank } from "@/types/offramp";

interface BankDetailsCardProps {
    formState: OfframpFormState;
    banks: Bank[];
    isLoadingBanks: boolean;
    isVerifyingAccount: boolean;
    onChange: (field: keyof OfframpFormState, value: string) => void;
}

// ─── Searchable Bank Combobox ────────────────────────────────────────────────
function BankCombobox({
    banks,
    value,
    onChange,
    disabled,
}: {
    banks: Bank[];
    value: string;
    onChange: (code: string) => void;
    disabled: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlighted, setHighlighted] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const selectedBank = banks.find((b) => b.code === value);

    const filtered = query.trim()
        ? banks.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()))
        : banks;

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Scroll highlighted item into view
    useEffect(() => {
        if (listRef.current) {
            const item = listRef.current.children[highlighted] as HTMLElement | undefined;
            item?.scrollIntoView({ block: "nearest" });
        }
    }, [highlighted]);

    const open = useCallback(() => {
        if (disabled) return;
        setIsOpen(true);
        setHighlighted(0);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, [disabled]);

    const select = useCallback((bank: Bank) => {
        onChange(bank.code);
        setIsOpen(false);
        setQuery("");
    }, [onChange]);

    const clear = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setQuery("");
        setIsOpen(false);
    }, [onChange]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") open();
            return;
        }
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlighted((h) => Math.max(h - 1, 0));
                break;
            case "Enter":
                e.preventDefault();
                if (filtered[highlighted]) select(filtered[highlighted]);
                break;
            case "Escape":
                setIsOpen(false);
                setQuery("");
                break;
        }
    };

    return (
        <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => (isOpen ? setIsOpen(false) : open())}
                disabled={disabled}
                className={[
                    "w-full flex items-center justify-between h-12 px-3 rounded-md border text-sm transition-colors",
                    "bg-fundable-dark border-gray-700 text-white",
                    "hover:border-gray-500 focus:outline-none focus:ring-1 focus:ring-fundable-purple",
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
            >
                <span className={selectedBank ? "text-white" : "text-gray-500"}>
                    {selectedBank ? selectedBank.name : "Select bank"}
                </span>
                <span className="flex items-center gap-1 ml-2 shrink-0">
                    {selectedBank && !disabled && (
                        <X
                            className="h-3.5 w-3.5 text-gray-400 hover:text-white"
                            onClick={clear}
                        />
                    )}
                    <ChevronDown
                        className={[
                            "h-4 w-4 text-gray-400 transition-transform duration-150",
                            isOpen ? "rotate-180" : "",
                        ].join(" ")}
                    />
                </span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-700 bg-fundable-dark shadow-lg">
                    {/* Search input */}
                    <div className="flex items-center gap-2 border-b border-gray-700 px-3 py-2">
                        <Search className="h-4 w-4 text-gray-400 shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setHighlighted(0); }}
                            placeholder="Search bank…"
                            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                        />
                        {query && (
                            <X
                                className="h-3.5 w-3.5 text-gray-400 hover:text-white cursor-pointer"
                                onClick={() => { setQuery(""); setHighlighted(0); }}
                            />
                        )}
                    </div>

                    {/* List */}
                    <ul ref={listRef} className="max-h-52 overflow-y-auto py-1">
                        {filtered.length === 0 ? (
                            <li className="px-3 py-2 text-sm text-gray-500">No banks found</li>
                        ) : (
                            filtered.map((bank, i) => (
                                <li
                                    key={bank.code}
                                    onMouseDown={() => select(bank)}
                                    onMouseEnter={() => setHighlighted(i)}
                                    className={[
                                        "flex items-center px-3 py-2 text-sm cursor-pointer transition-colors",
                                        i === highlighted
                                            ? "bg-fundable-violet text-white"
                                            : "text-gray-200 hover:bg-fundable-violet/60",
                                        bank.code === value ? "font-medium" : "",
                                    ].join(" ")}
                                >
                                    <span className="flex-1">{bank.name}</span>
                                    {bank.code === value && (
                                        <CheckCircle2 className="h-4 w-4 text-fundable-purple shrink-0" />
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

// ─── BankDetailsCard ─────────────────────────────────────────────────────────
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
                    {isLoadingBanks ? (
                        <div className="flex items-center gap-2 h-12 px-3 rounded-md border border-gray-700 bg-fundable-dark text-gray-400 text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading banks…</span>
                        </div>
                    ) : (
                        <BankCombobox
                            banks={banks}
                            value={formState.bankCode}
                            onChange={(code) => onChange("bankCode", code)}
                            disabled={isLoadingBanks}
                        />
                    )}
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
