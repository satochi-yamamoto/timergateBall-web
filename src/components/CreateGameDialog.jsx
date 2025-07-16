
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const CreateGameDialog = () => {
  const [open, setOpen] = useState(false);
  const [teamRedName, setTeamRedName] = useState('');
  const [teamWhiteName, setTeamWhiteName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    if (!teamRedName || !teamWhiteName) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Por favor, nomeie ambas as equipes.' });
      return;
    }
    setLoading(true);

    try {
      // 1. Create Red Team
      const { data: teamRedData, error: teamRedError } = await supabase
        .from('teams')
        .insert({ name: teamRedName, created_by: user.id })
        .select()
        .single();
      if (teamRedError) throw teamRedError;

      // 2. Add creator as captain to Red Team
      const { error: memberRedError } = await supabase
        .from('team_members')
        .insert({ team_id: teamRedData.id, user_id: user.id, is_captain: true });
      if (memberRedError) throw memberRedError;

      // 3. Create White Team
      const { data: teamWhiteData, error: teamWhiteError } = await supabase
        .from('teams')
        .insert({ name: teamWhiteName, created_by: user.id })
        .select()
        .single();
      if (teamWhiteError) throw teamWhiteError;
      
      // 4. Add creator as captain to White Team (can be changed later)
       const { error: memberWhiteError } = await supabase
        .from('team_members')
        .insert({ team_id: teamWhiteData.id, user_id: user.id, is_captain: true });
      if (memberWhiteError) throw memberWhiteError;

      // 5. Create Game with initial state
      const initialScores = {};
      const initialOuts = {};
      for (let i = 1; i <= 10; i++) {
        initialScores[i] = 0;
        initialOuts[i] = false;
      }
      const initialGameState = {
        status: 'lobby',
        timeLeft: 1800,
        scores: initialScores,
        outs: initialOuts,
      };

      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert({ 
          team_red_id: teamRedData.id, 
          team_white_id: teamWhiteData.id,
          game_state: initialGameState,
          status: 'lobby'
        })
        .select()
        .single();
      if (gameError) throw gameError;

      toast({ title: 'Sucesso!', description: 'Jogo criado. Redirecionando...' });
      setOpen(false);
      navigate(`/game/${gameData.id}`);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao criar jogo', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-28 text-lg bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex flex-col gap-1">
          <PlusCircle size={24} />
          Criar Novo Jogo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Criar Novo Jogo</DialogTitle>
          <DialogDescription className="text-gray-400">
            Crie as duas equipes para começar uma nova partida.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team-red" className="text-right text-red-400">
              Equipe Vermelha
            </Label>
            <Input
              id="team-red"
              value={teamRedName}
              onChange={(e) => setTeamRedName(e.target.value)}
              className="col-span-3 bg-gray-700 border-gray-600 text-white"
              placeholder="Nome da Equipe Vermelha"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team-white" className="text-right text-blue-300">
              Equipe Branca
            </Label>
            <Input
              id="team-white"
              value={teamWhiteName}
              onChange={(e) => setTeamWhiteName(e.target.value)}
              className="col-span-3 bg-gray-700 border-gray-600 text-white"
              placeholder="Nome da Equipe Branca"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateGame} disabled={loading} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            {loading ? 'Criando...' : 'Criar Jogo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameDialog;
