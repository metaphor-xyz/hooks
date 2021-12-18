import { ethers } from 'ethers';
import React from 'react';
export declare type Props = unknown;
export interface Context {
    connectProvider: (_provider: any) => void;
    connected: boolean;
    provider: ethers.providers.Web3Provider | null;
    mainAccount: string | null;
}
export default function WalletManagerProvider({ children }: React.PropsWithChildren<Props>): JSX.Element;
export declare function useWalletManager(): Context;
