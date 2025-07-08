import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, Trash2, Crown, ChevronsUpDown } from 'lucide-react';

const UserCombobox = ({ onSelectUser, disabled }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      if (search.length < 2 && !open) return; // Only search when typing or opened
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email')
          .ilike('email', `%${search}%`)
          .limit(10);
        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erro ao buscar usuários', description: error.message });
      }
    };
    
    const debounce = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounce);

  }, [search, open, toast]);
  
  const handleSelect = (user) => {
    setValue(user.id);
    setSearch(user.email);
    onSelectUser(user);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white"
          disabled={disabled}
        >
          {value
            ? users.find((user) => user.id === value)?.email || 'Selecione um jogador'
            : 'Selecione um jogador...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-gray-800 border-gray-700 text-white">
        <Command>
          <CommandInput 
            placeholder="Pesquisar e-mail..." 
            value={search}
            onValueChange={setSearch}
            className="text-white"
            />
          <CommandList>
            <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.email}
                  onSelect={() => handleSelect(user)}
                >
                  {user.email}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const ManageTeamScreen = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCaptain, setIsCaptain] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  
  const fetchTeamData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('name')
        .eq('id', teamId)
        .single();
      if (teamError) throw teamError;
      setTeam(teamData);

      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('is_captain, user:users(id, email)')
        .eq('team_id', teamId);
      if (membersError) throw membersError;
      setMembers(membersData);

      const currentUserMember = membersData.find(m => m.user.id === user.id);
      setIsCaptain(currentUserMember?.is_captain || false);

      const { data: usersData, error: usersError } = await supabase.from('users').select('id, email');
      if (usersError) throw usersError;
      const memberIds = membersData.map(m => m.user.id);
      setAllUsers(usersData.filter(u => !memberIds.includes(u.id)));

    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao carregar equipe', description: error.message });
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [teamId, user, toast, navigate]);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  const handleAddMember = async () => {
    if (!selectedUser) {
      toast({ variant: 'destructive', title: 'Nenhum jogador selecionado', description: 'Por favor, selecione um jogador para adicionar.' });
      return;
    }

    try {
      if (members.some(m => m.user.id === selectedUser.id)) {
        throw new Error('Este usuário já é membro da equipe.');
      }

      const { error: insertError } = await supabase
        .from('team_members')
        .insert({ team_id: teamId, user_id: selectedUser.id, is_captain: false });
      if (insertError) throw insertError;

      toast({ title: 'Sucesso!', description: `${selectedUser.email} foi adicionado à equipe.` });
      setSelectedUser(null);
      fetchTeamData(); 
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao adicionar membro', description: error.message });
    }
  };
  
  const handleRemoveMember = async (memberId) => {
    if (memberId === user.id) {
      toast({ variant: 'destructive', title: 'Ação não permitida', description: 'Você não pode remover a si mesmo.' });
      return;
    }
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', memberId);
      if (error) throw error;
      toast({ title: 'Membro removido', description: 'O usuário foi removido da equipe.' });
      fetchTeamData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao remover membro', description: error.message });
    }
  };

  const handleToggleCaptain = async (memberId, currentStatus) => {
     if (memberId === user.id) {
      toast({ variant: 'destructive', title: 'Ação não permitida', description: 'Você não pode alterar seu próprio status de capitão.' });
      return;
    }
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ is_captain: !currentStatus })
        .eq('team_id', teamId)
        .eq('user_id', memberId);
      if (error) throw error;
      toast({ title: 'Status de capitão atualizado!' });
      fetchTeamData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao atualizar status', description: error.message });
    }
  };

  if (loading) {
    return (
      <>
        <div className="h-screen w-screen bg-gray-900 flex items-center justify-center text-white">Carregando equipe...</div>
        </>
      );
    }

  if (!isCaptain) {
    return (
      <>
        <div className="h-screen w-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Acesso Negado</h1>
        <p className="text-gray-400 mb-8">Você não tem permissão para gerenciar esta equipe.</p>
        <Button onClick={() => navigate('/')}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Lobby</Button>
      </div>
        </>
      );
    }

  return (
    <>
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4 md:p-8 text-white">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <Button onClick={() => navigate('/')} variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Lobby
        </Button>

        <h1 className="text-4xl font-bold mb-2">Gerenciar Equipe</h1>
        <h2 className="text-2xl text-yellow-400 mb-8">{team?.name}</h2>

        <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Adicionar Novo Membro</h3>
          <div className="flex flex-col sm:flex-row gap-4">
             <UserCombobox onSelectUser={setSelectedUser} disabled={false} />
            <Button onClick={handleAddMember} className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <UserPlus className="mr-2 h-4 w-4" /> Adicionar
            </Button>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Membros da Equipe</h3>
          <ul className="space-y-4">
            {members.map((member) => (
              <motion.li
                key={member.user.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-gray-700/70 rounded-lg"
              >
                <div className="flex items-center gap-3">
                   {member.is_captain && <Crown className="h-5 w-5 text-yellow-400" />}
                  <span className="font-medium">{member.user.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`captain-switch-${member.user.id}`}>Capitão</Label>
                    <Switch
                      id={`captain-switch-${member.user.id}`}
                      checked={member.is_captain}
                      onCheckedChange={() => handleToggleCaptain(member.user.id, member.is_captain)}
                      disabled={member.user.id === user.id}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveMember(member.user.id)}
                    disabled={member.user.id === user.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
    </>
    );
  };

export default ManageTeamScreen;