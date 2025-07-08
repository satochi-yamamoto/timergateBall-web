import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const AuthScreen = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', 'recovery'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, sendPasswordReset } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (authMode === 'login') {
      await signIn(email, password);
    } else if (authMode === 'signup') {
      await signUp(email, password);
    } else if (authMode === 'recovery') {
      const { error } = await sendPasswordReset(email);
      if (!error) {
        toast({
          title: 'E-mail de recuperação enviado!',
          description: 'Verifique sua caixa de entrada para redefinir sua senha.',
        });
        setAuthMode('login');
      }
    }
    setLoading(false);
  };

  const getTitle = () => {
    if (authMode === 'login') return 'Faça login para continuar';
    if (authMode === 'signup') return 'Crie uma conta para começar';
    return 'Recuperar sua senha';
  };

  const getButtonText = () => {
    if (loading) return 'Carregando...';
    if (authMode === 'login') return 'Entrar';
    if (authMode === 'signup') return 'Registrar';
    return 'Enviar link de recuperação';
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Gateball Timer</h1>
          <p className="text-gray-400">{getTitle()}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-700 border-gray-600 text-white focus:ring-yellow-400"
            />
          </div>
          {authMode !== 'recovery' && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white focus:ring-yellow-400"
              />
            </div>
          )}
          <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold" disabled={loading}>
            {getButtonText()}
          </Button>
        </form>
        <div className="text-center space-y-2">
          {authMode === 'login' && (
            <>
              <Button variant="link" onClick={() => setAuthMode('signup')} className="text-yellow-400">
                Não tem uma conta? Registre-se
              </Button>
              <Button variant="link" onClick={() => setAuthMode('recovery')} className="text-gray-400 text-sm">
                Esqueceu a senha?
              </Button>
            </>
          )}
          {(authMode === 'signup' || authMode === 'recovery') && (
            <Button variant="link" onClick={() => setAuthMode('login')} className="text-yellow-400">
              Já tem uma conta? Faça login
            </Button>
          )}
        </div>
      </motion.div>
      </div>
    </>
  );
};

export default AuthScreen;