/**
 * @jest-environment ceramic
 */
import { randomBytes } from '@stablelib/random';
import { renderHook } from '@testing-library/react-hooks';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import React from 'react';

import { useDocument, CeramicProvider, useCeramic } from '../src';

jest.mock('../src/WalletManagerProvider');

const wrapper = ({ children }: React.PropsWithChildren<unknown>) => {
  const seed = randomBytes(32);
  const didProvider = new Ed25519Provider(seed);

  return (
    <CeramicProvider ceramic={ceramic} didProvider={didProvider}>
      {children}
    </CeramicProvider>
  );
};

test('can read a stream from id', async () => {
  const { result: ceramicResult, waitForNextUpdate } = renderHook(() => useCeramic(), { wrapper });
  await waitForNextUpdate();

  const createdStream = await ceramicResult.current.createStream({ test: 'test' });

  const { result, waitForNextUpdate: wait } = renderHook(() => useDocument(createdStream.id.toString()), { wrapper });
  await wait();

  expect(result.current.loading).toBe(false);
  expect(result.current.document?.content).toEqual({ test: 'test' });
});
