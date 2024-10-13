import { useState } from 'react';
import { signUp } from '../utils/auth'; // Create this file to house the signUp function

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signUp(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleSignUp, loading, error };
};