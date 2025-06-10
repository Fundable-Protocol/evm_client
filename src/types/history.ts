import { ColumnDef } from "@tanstack/react-table";
import { DistributionAttributes } from "./distribution";

export interface IHistoryData {
  id: string;
  type: string;
  date: string;
  amount: number;
  network: string;
  recipients: string;
  status: "all" | "pending" | "success" | "failed";
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface IHistoryQueryParams {
  page: number;
  limit: number;
  user_address: string;
  status?: DistributionAttributes["status"];
  type?: DistributionAttributes["distribution_type"];
}
