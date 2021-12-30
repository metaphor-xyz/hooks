/**
 * @jest-environment ceramic
 */
import { randomBytes } from '@stablelib/random';
import { renderHook } from '@testing-library/react-hooks';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import React from 'react';

import { CeramicProvider, useCeramic } from '../src';

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

test('ceramic client is initialized', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useCeramic(), { wrapper });
  await waitForNextUpdate();

  expect(result.current.client).toEqual(expect.anything());
});

test('stream can be created', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useCeramic(), { wrapper });
  await waitForNextUpdate();

  const stream = await result.current.createStream({ test: 'test' });

  expect(stream.content).toEqual({ test: 'test' });
});

test('stream can be loaded', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useCeramic(), { wrapper });
  await waitForNextUpdate();

  const createdStream = await result.current.createStream({ test: 'test' });
  const stream = await result.current.loadStream(createdStream.id);

  expect(stream.content).toEqual({ test: 'test' });
});
