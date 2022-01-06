import { ethers } from 'ethers';
import React, { useCallback, useState, createContext, useContext } from 'react';

export type Network = 'mainnet' | 'ropsten' | 'polygon';

export interface ProxyTokens {
  infura?: string;
  alchemy?: string;
  etherscan?: string;
}

export interface Props {
  authTokens?: ProxyTokens;
}

export interface Context {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connectProvider: (_provider: any) => void;
  connected: boolean;
  provider: ethers.providers.Web3Provider | null;
  mainAccount: string | null;
  getProvider: (_network: Network) => ethers.providers.BaseProvider;
  getSigner: (_network: Network) => ethers.Signer | null;
}

const WalletManagerContext = createContext<Context>(null!);

export default function WalletManagerProvider({ authTokens, children }: React.PropsWithChildren<Props>) {
  const [ethersProvider, setEthersProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [mainAccount, setMainAccount] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connectProvider = useCallback((provider: any) => {
    const etherProvider = new ethers.providers.Web3Provider(provider);
    setEthersProvider(etherProvider);
    etherProvider.listAccounts().then(accounts => setMainAccount(accounts[0]));
  }, []);

  const getProvider = useCallback((network: Network) => ethers.getDefaultProvider(network, authTokens), [authTokens]);

  const getSigner = useCallback(
    (network: Network) => {
      // todo(carlos): if not in correct network, make it correct network (if we can)
      if (ethersProvider && ethersProvider.network.name === network) {
        return ethersProvider.getSigner();
      }

      return null;
    },
    [ethersProvider]
  );

  return (
    <WalletManagerContext.Provider
      value={{
        connectProvider,
        connected: !!ethersProvider,
        provider: ethersProvider,
        mainAccount,
        getProvider,
        getSigner,
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
