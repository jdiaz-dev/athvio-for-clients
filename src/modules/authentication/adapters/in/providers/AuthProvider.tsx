import React, { ReactNode, useEffect, useState } from 'react';
import { createSessionCookies, getToken, getPatientId } from 'src/modules/authentication/adapters/out/storage';
import { AuthContext } from '../context/AuthContext';
import { CredentialsSignIn, JwtDto } from 'src/modules/authentication/adapters/out/authentication';
import { useAuthentication } from 'src/modules/authentication/adapters/out/authenticationActions';

function AuthProvider({ children }: { children: ReactNode }) {
  const { signIn } = useAuthentication();

  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getToken()));
  const [patient, setPatient] = useState('');

  const saveJwt = (data: JwtDto) => {
    createSessionCookies({ ...data });
    setIsAuthenticated(true);
  };
  const signInHandler = async (credentials: CredentialsSignIn) => {
    const { data } = await signIn(credentials);
    if (data) saveJwt(data.signIn);
  };

  const signOut = () => {};

  useEffect(() => {
    const getPatient = async () => {
      const patient = await getPatientId();
      setPatient(patient);
    };
    getPatient();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        patient,
        signInHandler,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
