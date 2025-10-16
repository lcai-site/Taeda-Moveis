
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="pb-4 border-b border-dark-border">
      <h1 className="text-3xl font-bold text-dark-text-primary tracking-tight">
        Meta Ads Performance
      </h1>
      <p className="text-dark-text-secondary mt-1">
        Dashboard de resultados de campanhas para clientes.
      </p>
    </header>
  );
};

export default Header;
