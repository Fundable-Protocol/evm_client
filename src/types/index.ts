export interface TokenOption {
  symbol: string;
  address: string;
  decimals: number;
}

export interface AppSelectProps {
  title: string;
  placeholder?: string;
  setValue: (value: string) => void;
  options: { label: string; value: string }[];
}
