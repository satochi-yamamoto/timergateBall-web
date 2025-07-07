import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen py-8 px-4 max-w-3xl mx-auto">
      <Helmet>
        <title>Política de Privacidade</title>
        <meta name="description" content="Saiba como tratamos seus dados no gerador de currículos." />
        <meta name="google-adsense-account" content="ca-pub-4789090074866563" />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4 text-white">Política de Privacidade</h1>
      <p className="mb-4 text-gray-300">
        Este site utiliza apenas cookies essenciais para seu funcionamento. Nenhuma informação pessoal é armazenada em nossos servidores. Os dados informados são usados somente para gerar seu currículo e são excluídos após o processamento.
      </p>
      <p className="mb-4 text-gray-300">
        Ao prosseguir utilizando o gerador de currículos, você concorda com esta política de privacidade.
      </p>
      <Button onClick={() => navigate('/')} variant="outline" className="border-white/20 text-white hover:bg-white/10">
        Voltar para a página inicial
      </Button>
    </div>
  );
}

export default PrivacyPolicy;
