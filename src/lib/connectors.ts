import {
  isInArgentMobileAppBrowser,
  ArgentMobileConnector,
} from "starknetkit/argentMobile";
import {
  BraavosMobileConnector,
  isInBraavosMobileAppBrowser,
} from "starknetkit/braavosMobile";

import { InjectedConnector } from "starknetkit/injected";
import { WebWalletConnector } from "starknetkit/webwallet";

import { constants } from "starknet";
import { Connector } from "@starknet-react/core"; // Import Connector from starknet-react
import { projectId } from "./constant";

export const getAvailableConnectors = async (): Promise<Connector[]> => {
  const connectors: Connector[] = [];

  // Initialize Argent Mobile with error handling
  try {
    const argentMobile = ArgentMobileConnector.init({
      options: {
        dappName: "Fundable",
        url:
          typeof window !== "undefined"
            ? window.location.href
            : "staging.fundable.finance",
        chainId: constants.NetworkName.SN_MAIN,
        projectId: projectId,
        description: "Your web3 automated payment processor",
      },
    }) as Connector;
    connectors.push(argentMobile);
  } catch  {}

  // Load Cartridge controller asynchronously
  try {
    const cartridgeController = await import("@/lib/utills/controller").then((mod) =>
      mod.getCartridgeInstance()
    );
    
    if (cartridgeController) {
      connectors.push(cartridgeController as Connector);
    }
  } catch {}

  // Initialize injected connectors with error handling
  const connectorOptions = [
    { id: "braavos", name: "Braavos" },
    { id: "argentX", name: "Argent X" },
    { id: "keplr", name: "Keplr" },
    { id: "metamask", name: "MetaMask" },
    { id: "okxwallet", name: "OKX" },
    { id: "fordefi", name: "Fordefi" },
  ];

  connectorOptions.forEach((connector) => {
    try {
      const injectedConnector = new InjectedConnector({ options: connector }) as Connector;
      connectors.push(injectedConnector);
    } catch {}
  });

  // Initialize Web Wallet with error handling
  try {
    const webWallet = new WebWalletConnector({ url: "https://web.argent.xyz" }) as Connector;
    connectors.push(webWallet);
  } catch {}

  // Handle mobile app browsers
  switch (true) {
    case isInArgentMobileAppBrowser():
      // Return only Argent Mobile if in Argent app browser
      return connectors.filter(connector => 
        (connector as Connector).id === "argentMobile" || 
        connector.constructor.name === "ArgentMobileConnector"
      );

    case isInBraavosMobileAppBrowser():
      try {
        const braavosMobile = BraavosMobileConnector.init({}) as Connector;
        const relevantConnectors = [braavosMobile];
        
        // Add Argent Mobile if it was successfully initialized
        const argentConnector = connectors.find(connector => 
          (connector as Connector).id === "argentMobile" || 
          connector.constructor.name === "ArgentMobileConnector"
        );
        if (argentConnector) {
          relevantConnectors.push(argentConnector);
        }
        
        return relevantConnectors;
      } catch {}

    default:
      break;
  }

  return connectors;
};
