import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="text-center text-gray-400 text-sm py-6">
      <div>
        <Link to="/privacy-policy" className="hover:underline">Política de Privacidade</Link>
        <span className="mx-1">|</span>
        <Link to="/terms-of-service" className="hover:underline">Termos de Uso</Link>
      </div>
      <div className="mt-2">
        © 2025 YD Software. Todos os direitos reservados. Sistema 100% local e seguro.
      </div>
    </footer>
  );
}

export default Footer;
