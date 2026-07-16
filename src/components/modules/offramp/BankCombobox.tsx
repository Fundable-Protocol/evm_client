"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { OFFRAMP_BANK_SELECTOR_COPY } from "@/lib/offramp/offramp.constants";
import { filterOfframpBanks } from "@/lib/offramp/offramp.utils";
import type { OfframpBank } from "@/types/offramp";

interface BankComboboxProps {
  banks: OfframpBank[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function BankCombobox({
  banks,
  value,
  onValueChange,
  disabled = false,
  isLoading = false,
}: BankComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const selectedBank = banks.find((bank) => bank.code === value);
  const filteredBanks = useMemo(
    () => filterOfframpBanks(banks, query),
    [banks, query],
  );

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.clearTimeout(focusTimer);
    };
  }, [isOpen]);

  const selectBank = (bank: OfframpBank) => {
    onValueChange(bank.code);
    setIsOpen(false);
    setQuery("");
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      setQuery("");
      return;
    }

    if (!filteredBanks.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % filteredBanks.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (current) => (current - 1 + filteredBanks.length) % filteredBanks.length,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectBank(filteredBanks[activeIndex] ?? filteredBanks[0]);
    }
  };

  return (
    <div ref={containerRef} className="relative mt-2">
      <button
        id="offramp-bank"
        type="button"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => {
          setIsOpen((current) => !current);
          setActiveIndex(0);
        }}
        className="flex h-12 w-full items-center justify-between gap-3 rounded border border-gray-700 bg-black/20 px-3 text-left text-sm text-white outline-none transition-colors focus-visible:border-fundable-purple-2 focus-visible:ring-2 focus-visible:ring-fundable-purple-2/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={selectedBank ? "truncate text-white" : "truncate text-gray-500"}>
          {isLoading
            ? OFFRAMP_BANK_SELECTOR_COPY.loading
            : selectedBank?.name ?? OFFRAMP_BANK_SELECTOR_COPY.placeholder}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-gray-400" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-700 bg-fundable-mid-dark p-1 text-white shadow-xl">
          <div className="m-1 flex h-10 items-center gap-3 rounded border border-gray-700 bg-black/30 px-3 focus-within:border-fundable-purple-2 focus-within:ring-2 focus-within:ring-fundable-purple-2/30">
            <Search className="size-4 shrink-0 text-gray-400" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder={OFFRAMP_BANK_SELECTOR_COPY.searchPlaceholder}
              aria-label={OFFRAMP_BANK_SELECTOR_COPY.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>

          <div id={listboxId} role="listbox" className="max-h-64 overflow-y-auto p-1">
            {filteredBanks.length ? (
              filteredBanks.map((bank, index) => {
                const isSelected = bank.code === value;
                const isActive = index === activeIndex;

                return (
                  <button
                    key={bank.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectBank(bank)}
                    className={`flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2 text-left text-sm outline-none transition-colors ${
                      isActive
                        ? "bg-fundable-purple-light text-white"
                        : "text-white hover:bg-fundable-purple-light hover:text-white focus:bg-fundable-purple-light focus:text-white"
                    }`}
                  >
                    <span className="truncate">{bank.name}</span>
                    {isSelected ? <Check className="size-4 shrink-0" aria-hidden="true" /> : null}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-6 text-center text-sm text-gray-400">
                {OFFRAMP_BANK_SELECTOR_COPY.empty}
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
