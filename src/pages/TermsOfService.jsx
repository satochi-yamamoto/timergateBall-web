import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function TermsOfService() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen py-8 px-4 max-w-3xl mx-auto">
      <Helmet>
        <title>Termos de Uso</title>
        <meta name="description" content="Conheça os termos de uso do gerador de currículos." />
        <meta name="google-adsense-account" content="ca-pub-4789090074866563" />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4 text-white">Termos de Uso</h1>
      <p className="mb-4 text-gray-300">
        Este serviço é fornecido "como está" sem garantias de qualquer tipo. Não armazenamos permanentemente suas informações e o conteúdo gerado é de sua responsabilidade.
      </p>
      <p className="mb-4 text-gray-300">
        Ao utilizar o gerador de currículos você concorda em usar as informações geradas de forma ética e legal.
      </p>
      <Button onClick={() => navigate('/')} variant="outline" className="border-white/20 text-white hover:bg-white/10">
        Voltar para a página inicial
      </Button>
    </div>
  );
}

export default TermsOfService;
