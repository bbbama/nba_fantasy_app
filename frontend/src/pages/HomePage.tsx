import React from 'react';
import { useAuth } from '../AuthContext';

export const HomePage = () => {
  const { token, logout } = useAuth(); // Używamy hooka useAuth

  return (
    <div>
      <h1>Witaj w NBA Fantasy!</h1>
      {token ? ( // Sprawdzamy, czy token istnieje (użytkownik jest zalogowany)
        <>
          <p>Jesteś zalogowany. Wkrótce zobaczysz tu swoją drużynę i punkty.</p>
          <button onClick={logout}>Wyloguj się</button>
        </>
      ) : (
        <p>Proszę się zalogować, aby zobaczyć swoją stronę główną.</p>
      )}
    </div>
  );
};

export default HomePage;
