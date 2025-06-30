import { entity } from "simpler-state";
import { DistributionAttributes } from "@/types/distribution";

export interface ResendDistributionState {
  isResendModalOpen: boolean;
  selectedDistribution: DistributionAttributes | null;
  isResending: boolean;
  resendError: string | null;
}

export const resendDistributionEntity = entity<ResendDistributionState>({
  isResendModalOpen: false,
  selectedDistribution: null,
  isResending: false,
  resendError: null,
});

export const resendDistributionPayload = entity<DistributionAttributes | null>(
  null
);

export const resendDistributionActions = {
  openResendModal: (distribution: DistributionAttributes) => {
    resendDistributionEntity.set({
      isResendModalOpen: true,
      selectedDistribution: distribution,
      isResending: false,
      resendError: null,
    });
  },

  closeResendModal: () => {
    resendDistributionEntity.set({
      isResendModalOpen: false,
      selectedDistribution: null,
      isResending: false,
      resendError: null,
    });
  },

  setResending: (isResending: boolean) => {
    resendDistributionEntity.set((prev) => ({
      ...prev,
      isResending,
    }));
  },

  setResendError: (error: string | null) => {
    resendDistributionEntity.set((prev) => ({
      ...prev,
      resendError: error,
    }));
  },
};
