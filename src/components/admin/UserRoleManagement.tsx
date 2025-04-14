
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  getUsersWithRoles, 
  assignRoleToUser, 
  removeRoleFromUser, 
  checkUserHasRole, 
  UserRole 
} from '@/services/roleService';

const UserRoleManagement = () => {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user is an admin
  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await checkUserHasRole('admin');
      setIsAdmin(admin);
    };
    
    checkAdmin();
  }, []);

  // Fetch users with their roles
  const { 
    data: users = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['usersWithRoles'],
    queryFn: getUsersWithRoles,
    enabled: isAdmin
  });

  // Handle role assignment
  const handleAssignRole = async (userId: string, role: UserRole) => {
    const result = await assignRoleToUser(userId, role);
    
    if (result.success) {
      toast({
        title: 'Rôle assigné',
        description: `Le rôle ${role} a été assigné avec succès.`,
      });
      refetch();
    } else {
      toast({
        title: 'Erreur',
        description: result.error || 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  // Handle role removal
  const handleRemoveRole = async (userId: string, role: UserRole) => {
    const result = await removeRoleFromUser(userId, role);
    
    if (result.success) {
      toast({
        title: 'Rôle retiré',
        description: `Le rôle ${role} a été retiré avec succès.`,
      });
      refetch();
    } else {
      toast({
        title: 'Erreur',
        description: result.error || 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg text-white">
        <h2 className="text-xl font-bold mb-4">Gestion des Rôles</h2>
        <p>Vous n'avez pas les permissions pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-4">Gestion des Rôles Utilisateurs</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
        </div>
      ) : (
        <Table className="border-collapse border border-gray-700">
          <TableCaption>Liste des utilisateurs et leurs rôles</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="border border-gray-700">Email</TableHead>
              <TableHead className="border border-gray-700">Rôles</TableHead>
              <TableHead className="border border-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="border border-gray-700">{user.email}</TableCell>
                <TableCell className="border border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {user.roles.length > 0 ? (
                      user.roles.map(role => (
                        <Badge key={role} className={
                          role === 'admin' 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : role === 'moderator' 
                              ? 'bg-yellow-500 hover:bg-yellow-600' 
                              : 'bg-blue-500 hover:bg-blue-600'
                        }>
                          {role}
                          <button 
                            onClick={() => handleRemoveRole(user.id, role)}
                            className="ml-2 text-xs"
                          >
                            ✕
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400">Aucun rôle</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="border border-gray-700">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignRole(user.id, 'admin')}
                      className="text-xs bg-transparent border-red-500 text-red-500 hover:bg-red-500/10"
                      disabled={user.roles.includes('admin')}
                    >
                      + Admin
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignRole(user.id, 'moderator')}
                      className="text-xs bg-transparent border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                      disabled={user.roles.includes('moderator')}
                    >
                      + Modérateur
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-gray-400">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UserRoleManagement;
