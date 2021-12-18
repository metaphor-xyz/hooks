import { ethers } from 'ethers';
import React, { useCallback, useState, createContext, useContext } from 'react';

export type Props = unknown;

export interface Context {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connectProvider: (_provider: any) => void;
  connected: boolean;
  provider: ethers.providers.Web3Provider | null;
  mainAccount: string | null;
}

const WalletManagerContext = createContext<Context>(null!);

export default function WalletManagerProvider({ children }: React.PropsWithChildren<Props>) {
  const [ethersProvider, setEthersProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [mainAccount, setMainAccount] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connectProvider = useCallback((provider: any) => {
    const etherProvider = new ethers.providers.Web3Provider(provider);
    setEthersProvider(etherProvider);
    etherProvider.listAccounts().then(accounts => setMainAccount(accounts[0]));
  }, []);

  return (
    <WalletManagerContext.Provider
      value={{
        connectProvider,
        connected: !!ethersProvider,
        provider: ethersProvider,
        mainAccount,
      }}
    >
      {children}
    </WalletManagerContext.Provider>
  );
}

export function useWalletManager() {
  const context = useContext(WalletManagerContext);

  if (!context) {
    throw new Error('useWalletManager must be used inside WalletManagerProvider');
  }

  return context;
}
