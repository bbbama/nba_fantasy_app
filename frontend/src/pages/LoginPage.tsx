import React from 'react';

const LoginPage = () => {
  return (
    <div>
      <h2>Logowanie</h2>
      {/* Formularz logowania zostanie dodany tutaj */}
      <form>
        <div>
          <label>Email:</label>
          <input type="email" />
        </div>
        <div>
          <label>Hasło:</label>
          <input type="password" />
        </div>
        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
};

export default LoginPage;
