import type { TileDocument } from '@ceramicnetwork/stream-tile';
import { useEffect, useState } from 'react';

import { useCeramic } from './CeramicProvider';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useDocument<T = Record<string, any>>(streamId: string) {
  const { loadStream } = useCeramic();
  const [document, setDocument] = useState<TileDocument<T> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStream(streamId).then(doc => {
      setDocument(doc as TileDocument<T>);
      setLoading(false);
    });
  }, [streamId, loadStream]);

  return { document, loading };
}
