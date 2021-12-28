import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect';
import { CeramicApi } from '@ceramicnetwork/common';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { DID } from 'dids';
import KeyDidResolver from 'key-did-resolver';
import React, { useRef, useEffect, createContext, useContext } from 'react';

import { useWalletManager } from './WalletManagerProvider';

const didResolver = {
  ...KeyDidResolver.getResolver(),
};

export interface Props {
  apiUrl: string;
}

export interface Context {
  client: CeramicApi;
}

const CeramicContext = createContext<Context>(null!);

export default function CeramicProvider({ apiUrl, children }: React.PropsWithChildren<Props>) {
  const client = useRef(new CeramicClient(apiUrl));
  const { connected, provider, mainAccount } = useWalletManager();

  useEffect(() => {
    if (connected && provider && mainAccount) {
      client.current.did = new DID({ resolver: didResolver });

      const threeIdConnect = new ThreeIdConnect();
      const authProvider = new EthereumAuthProvider(provider, mainAccount);
      threeIdConnect
        .connect(authProvider)
        .then(() => threeIdConnect.getDidProvider())
        .then(didProvider => {
          if (client.current?.did) {
            client.current.did.setProvider(didProvider);
            client.current.did.authenticate();
          }
        });
    }
  }, [connected, mainAccount, provider]);

  return (
    <CeramicContext.Provider
      value={{
        client: client.current,
      }}
    >
      {children}
    </CeramicContext.Provider>
  );
}

export function useCeramic() {
  const context = useContext(CeramicContext);

  if (!context) {
    throw new Error('useCeramic must be used inside CeramicProvider');
  }

  return context;
}
