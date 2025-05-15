"use client";

import React from "react";
import {
  WalletProvider,
  SuiDevnetChain,
  SuiTestnetChain,
  SuiMainnetChain,
} from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

/**
 * Global client‑side providers.
 * Extend here if you later add React‑Query, Theme, etc.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider
      autoConnect={false}
      chains={[SuiDevnetChain, SuiTestnetChain, SuiMainnetChain]}
    >
      {children}
    </WalletProvider>
  );
}
