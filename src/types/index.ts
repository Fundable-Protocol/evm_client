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

export type ErrorWithCode = Error & { code: string };

type Success<T> = {
  data: T;
  error: null;
  success: boolean;
};

type Failure<E> = {
  data: null;
  error: E;
  success: boolean;
};

export type PromiseResult<T, E = ErrorWithCode> = Success<T> | Failure<E>;
