"use client";

import { Connector } from "starknetkit";

export async function getCartridgeInstance() {
  const [{ default: ControllerConnector }, {}, { constants }] =
    await Promise.all([
      import("@cartridge/connector/controller"),
      import("@starknet-react/core"),
      import("starknet"),
    ]);

  const instance = new ControllerConnector({
    chains: [
      { rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia" },
      { rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet" },
    ],
    defaultChainId: constants.StarknetChainId.SN_SEPOLIA,
  }) as unknown as InstanceType<typeof Connector>;

  return instance;
}
