// "use client";

// import { ReactNode } from "react";
// import { ReownProvider } from "@reown/appkit";
// import { mainnet, arbitrum, base } from "@reown/appkit/chains";
// import { MetaMaskConnector, WalletConnectConnector } from "@reown/appkit/connectors";

// const EVMProvider = ({ children }: { children: ReactNode }) => {
//   const connectors = [
//     new MetaMaskConnector({
//       options: {
//         shimDisconnect: true,
//       },
//     }),
//     new WalletConnectConnector({
//       options: {
//         projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
//         metadata: {
//           name: "Your dApp Name",
//           description: "Your dApp Description",
//           url: typeof window !== "undefined" ? window.location.origin : "",
//           icons: ["https://your-app-icon.com/icon.png"],
//         },
//       },
//     }),
//   ];

//   return (
//     <ReownProvider
//       chains={[mainnet, arbitrum, base]}
//       connectors={connectors}
//       autoConnect={true}
//     >
//       {children}
//     </ReownProvider>
//   );
// };

// export default EVMProvider; 