import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { CeramicApi } from '@ceramicnetwork/common';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { DID, DIDProvider } from 'dids';
import KeyDidResolver from 'key-did-resolver';
import React, { useRef, useEffect, createContext, useContext, useState, useCallback } from 'react';

import { useWalletManager } from './WalletManagerProvider';

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

interface BaseProps {
  didProvider?: DIDProvider | null;
  apiUrl?: string;
  ceramic?: CeramicApi;
}

export type CeramicProviderProps = RequireAtLeastOne<BaseProps, 'apiUrl' | 'ceramic'>;

export interface Context {
  client: CeramicApi;
  authenticated: boolean;
  createStream: OmitFirstArg<typeof TileDocument.create>;
  loadStream: OmitFirstArg<typeof TileDocument.load>;
}

const CeramicContext = createContext<Context>(null!);

export default function CeramicProvider({
  children,
  didProvider,
  ...props
}: React.PropsWithChildren<CeramicProviderProps>) {
  const client = useRef(props.ceramic ? props.ceramic : new CeramicClient(props.apiUrl));
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const didResolver = {
      ...KeyDidResolver.getResolver(),
      ...ThreeIdResolver.getResolver(client.current),
    };

    client.current.did = new DID({ resolver: didResolver });

    if (client.current?.did && didProvider) {
      client.current.did.setProvider(didProvider);
      client.current.did.authenticate().then(() => setAuthenticated(true));
    }
  }, [didProvider]);

  const createStream = useCallback(
    (content, metadata, opts) => TileDocument.create(client.current, content, metadata, { pin: true, ...opts }),
    []
  );

  const loadStream = useCallback(
    (streamId, opts) => TileDocument.load(client.current, streamId, { pin: true, ...opts }),
    []
  );

  return (
    <CeramicContext.Provider
      value={{
        client: client.current,
        authenticated,
        createStream,
        loadStream,
      }}
    >
      {children}
    </CeramicContext.Provider>
  );
}

export type CeramicProviderWithWalletProps = Exclude<CeramicProviderProps, 'didProvider'>;

export function CeramicProviderWithWallet({
  children,
  ...props
}: React.PropsWithChildren<CeramicProviderWithWalletProps>) {
  const { connected, provider, mainAccount } = useWalletManager();
  const [didProvider, setDidProvider] = useState<DIDProvider | null>(null);

  useEffect(() => {
    if (connected && provider && mainAccount) {
      const threeIdConnect = new ThreeIdConnect();
      const authProvider = new EthereumAuthProvider(provider.provider, mainAccount);
      threeIdConnect
        .connect(authProvider)
        .then(() => threeIdConnect.getDidProvider())
        .then(setDidProvider);
    }
  }, [connected, mainAccount, provider]);

  return (
    <CeramicProvider didProvider={didProvider} {...props}>
      {children}
    </CeramicProvider>
  );
}

export function useCeramic() {
  const context = useContext(CeramicContext);

  if (!context) {
    throw new Error('useCeramic must be used inside CeramicProvider');
  }

  return context;
}
