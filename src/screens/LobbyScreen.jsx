import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut, Trash2, Settings } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import CreateGameDialog from '@/components/CreateGameDialog';
import ManageTeamsDialog from '@/components/ManageTeamsDialog';

const LobbyScreen = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [finishedGames, setFinishedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isManageTeamsDialogOpen, setManageTeamsDialogOpen] = useState(false);
  const [deleteGameId, setDeleteGameId] = useState(null);

  const fetchGames = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('id, team_red:teams!games_team_red_id_fkey(name), team_white:teams!games_team_white_id_fkey(name), status')
        .order('created_at', { ascending: false });

      if (gameError) {
        toast({ variant: "destructive", title: "Erro ao buscar jogos", description: gameError.message });
        setGames([]);
        setFinishedGames([]);
      } else {
        setGames((gameData || []).filter(g => g.status !== 'finished'));
        setFinishedGames((gameData || []).filter(g => g.status === 'finished'));
      }

    } catch (error) {
        toast({ variant: "destructive", title: "Ocorreu um erro inesperado", description: error.message });
    } finally {
        setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchGames();
    
    const gameListener = supabase.channel('public:games')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, (payload) => {
          fetchGames();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(gameListener);
    }

  }, [fetchGames]);

  const handleDeleteGame = async () => {
    if (!deleteGameId) return;
    try {
      const { error } = await supabase.from('games').delete().eq('id', deleteGameId);
      if (error) throw error;
      toast({ title: 'Jogo removido com sucesso' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao remover jogo', description: error.message });
    } finally {
      setDeleteGameId(null);
      fetchGames();
    }
  };

  return (
    <>
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col items-center p-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl p-6"
      >
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Bem-vindo, {user?.email?.split('@')[0] || 'Jogador'}!</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/account')} variant="ghost" className="text-gray-300 hover:text-white">
              <Settings className="mr-2 h-4 w-4" /> Conta
            </Button>
            <Button onClick={signOut} variant="ghost" className="text-red-400 hover:text-red-500 hover:bg-red-900/20">
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div whileHover={{ scale: 1.03 }}>
            <CreateGameDialog />
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }}>
             <Button onClick={() => setManageTeamsDialogOpen(true)} variant="outline" className="w-full h-28 text-lg bg-transparent border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black flex flex-col gap-1">
              <Users size={28}/>
              Gerenciar Equipes
            </Button>
          </motion.div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Jogos Ativos</h2>
          <div className="bg-gray-800/50 rounded-lg p-4 min-h-[200px] max-h-[60vh] overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-400">Carregando jogos...</p>
            ) : games.length === 0 ? (
              <p className="text-center text-gray-400 pt-10">Nenhum jogo ativo. Que tal criar um?</p>
            ) : (
              <ul className="space-y-3">
                <AnimatePresence>
                  {games.map((game, index) => (
                    <motion.li
                      key={game.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700/70 p-4 rounded-lg flex justify-between items-center hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <span className="font-bold text-red-400">{game.team_red?.name || 'Equipe Vermelha'}</span>
                        <span className="mx-2 text-gray-400">vs</span>
                        <span className="font-bold text-blue-300">{game.team_white?.name || 'Equipe Branca'}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => navigate(`/game/${game.id}`)}>
                          Entrar no Jogo
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => setDeleteGameId(game.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Jogos Finalizados</h2>
          <div className="bg-gray-800/50 rounded-lg p-4 min-h-[200px] max-h-[60vh] overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-400">Carregando jogos...</p>
            ) : finishedGames.length === 0 ? (
              <p className="text-center text-gray-400 pt-10">Nenhum jogo finalizado.</p>
            ) : (
              <ul className="space-y-3">
                <AnimatePresence>
                  {finishedGames.map((game, index) => (
                    <motion.li
                      key={game.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700/70 p-4 rounded-lg flex justify-between items-center hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <span className="font-bold text-red-400">{game.team_red?.name || 'Equipe Vermelha'}</span>
                        <span className="mx-2 text-gray-400">vs</span>
                        <span className="font-bold text-blue-300">{game.team_white?.name || 'Equipe Branca'}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => navigate(`/game/${game.id}`)}>
                          Ver Jogo
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => setDeleteGameId(game.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>

      </motion.div>
      <ManageTeamsDialog open={isManageTeamsDialogOpen} onOpenChange={setManageTeamsDialogOpen} />
      <ConfirmDialog
        open={deleteGameId !== null}
        onOpenChange={(open) => !open && setDeleteGameId(null)}
        onConfirm={handleDeleteGame}
        title="Remover Jogo"
        description="Tem certeza que deseja remover este jogo? Esta ação é irreversível."
        confirmText="Remover"
        cancelText="Cancelar"
      />
    </div>
      </>
    );
  };

export default LobbyScreen;
