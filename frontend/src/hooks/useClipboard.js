import { useState, useCallback } from 'react';

export const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState(null);

  const copy = useCallback(async (text) => {
    try {
      if (!navigator?.clipboard) {
        throw new Error('Clipboard API not supported');
      }

      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setError(null);

      // Reset after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);

      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      setError(err);
      setIsCopied(false);
      return false;
    }
  }, []);

  const read = useCallback(async () => {
    try {
      if (!navigator?.clipboard) {
        throw new Error('Clipboard API not supported');
      }

      const text = await navigator.clipboard.readText();
      setError(null);
      return text;
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      setError(err);
      return null;
    }
  }, []);

  return {
    copy,
    read,
    isCopied,
    error,
    isSupported: typeof navigator !== 'undefined' && !!navigator.clipboard
  };
};

export default useClipboard;
