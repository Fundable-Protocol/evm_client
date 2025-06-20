import { Dispatch, SetStateAction } from "react";
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
  onStatusFilterChange: Dispatch<
    SetStateAction<DistributionAttributes["status"] | "all">
  >;
  onTypeFilterChange: Dispatch<
    SetStateAction<DistributionAttributes["distribution_type"] | "all">
  >;
  statusFilter: DistributionAttributes["status"] | "all";
  typeFilter: DistributionAttributes["distribution_type"] | "all";
  totalCount?: number;
  page: number;
  limit: number;
}

export interface IHistoryQueryParams {
  page: number;
  limit: number;
  user_address: string;
  status?: DistributionAttributes["status"];
  type?: DistributionAttributes["distribution_type"];
}

export interface DistributionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  distribution: DistributionAttributes | null;
}

export interface ActionsCellProps {
  distribution: DistributionAttributes;
}

export interface IAction {
  label: string;
  icon: React.ElementType;
  onClick: (distribution: ActionsCellProps["distribution"]) => void;
}

export type distributionFilterType = "status" | "type";

export type distributionFilterValueType =
  | DistributionAttributes["status"]
  | DistributionAttributes["distribution_type"]
  | "all";
