
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { motion } from 'framer-motion';

const ManageTeamsDialog = ({ open, onOpenChange }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchCaptainTeams = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: lobbyGames, error: gamesError } = await supabase
        .from('games')
        .select('team_red_id, team_white_id')
        .eq('status', 'lobby');

      if (gamesError) throw gamesError;

      const lobbyTeamIds = lobbyGames
        ? lobbyGames.flatMap(g => [g.team_red_id, g.team_white_id])
        : [];

      if (lobbyTeamIds.length === 0) {
        setTeams([]);
        return;
      }

      const { data, error } = await supabase
        .from('team_members')
        .select('team:teams(id, name)')
        .eq('user_id', user.id)
        .eq('is_captain', true)
        .in('team_id', lobbyTeamIds);

      if (error) throw error;

      const captainTeams = data.map(item => item.team).filter(Boolean);
      setTeams(captainTeams);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao buscar equipes', description: error.message });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (open) {
      fetchCaptainTeams();
    }
  }, [open, fetchCaptainTeams]);

  const handleSelectTeam = (teamId) => {
    onOpenChange(false);
    navigate(`/team/${teamId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Gerenciar Equipes</DialogTitle>
          <DialogDescription className="text-gray-400">
            Selecione uma equipe que você capitaneia para gerenciar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <p>Carregando suas equipes...</p>
          ) : teams.length === 0 ? (
            <p className="text-center text-gray-400">Você não é capitão de nenhuma equipe em jogos no Lobby.</p>
          ) : (
            <ul className="space-y-3">
              {teams.map((team) => (
                <motion.li key={team.id} whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={() => handleSelectTeam(team.id)}
                    variant="outline"
                    className="w-full justify-start text-lg p-6 bg-gray-700 border-gray-600 hover:bg-yellow-500 hover:text-black"
                  >
                    {team.name}
                  </Button>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageTeamsDialog;
