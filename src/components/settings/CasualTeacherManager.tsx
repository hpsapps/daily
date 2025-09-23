import { useState, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import type { CasualTeacher } from '../../types';

const CasualTeacherManager = () => {
  const { state, dispatch } = useContext(AppContext);
  const { casuals } = state;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCasual, setCurrentCasual] = useState<CasualTeacher | null>(null);
  const [newCasualName, setNewCasualName] = useState('');
  const [newCasualEmail, setNewCasualEmail] = useState('');
  const [newCasualPhone, setNewCasualPhone] = useState('');

  const handleAddCasual = () => {
    if (!newCasualName) {
      alert('Casual teacher name is required.');
      return;
    }
    const newCasual: CasualTeacher = {
      id: `casual-${Date.now()}`,
      name: newCasualName,
      email: newCasualEmail,
      phone: newCasualPhone,
    };
    dispatch({ type: 'ADD_CASUAL', payload: newCasual });
    console.log('Adding casual:', newCasual);
    setNewCasualName('');
    setNewCasualEmail('');
    setNewCasualPhone('');
    setIsAddModalOpen(false);
  };

  const handleEditCasual = () => {
    if (!currentCasual || !currentCasual.name) {
      alert('Casual teacher name is required.');
      return;
    }
    dispatch({ type: 'UPDATE_CASUAL', payload: currentCasual });
    console.log('Updating casual:', currentCasual);
    setCurrentCasual(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteCasual = (id: string) => {
    if (confirm('Are you sure you want to delete this casual teacher?')) {
      dispatch({ type: 'DELETE_CASUAL', payload: id });
      console.log('Deleting casual:', id);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsAddModalOpen(true)} className="mb-4">Add Casual Teacher</Button>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {casuals.length > 0 ? (
              casuals.map((casual) => (
                <TableRow key={casual.id}>
                  <TableCell>{casual.name}</TableCell>
                  <TableCell>{casual.email}</TableCell>
                  <TableCell>{casual.phone}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setCurrentCasual(casual);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCasual(casual.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No casual teachers added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Casual Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Casual Teacher</DialogTitle>
            <DialogDescription>
              Add a new casual teacher to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="addName" className="text-right">
                Name
              </Label>
              <Input
                id="addName"
                value={newCasualName}
                onChange={(e) => setNewCasualName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="addEmail" className="text-right">
                Email
              </Label>
              <Input
                id="addEmail"
                type="email"
                value={newCasualEmail}
                onChange={(e) => setNewCasualEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="addPhone" className="text-right">
                Phone
              </Label>
              <Input
                id="addPhone"
                type="tel"
                value={newCasualPhone}
                onChange={(e) => setNewCasualPhone(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCasual}>Add Casual</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Casual Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Casual Teacher</DialogTitle>
            <DialogDescription>
              Edit the details of the selected casual teacher.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editName" className="text-right">
                Name
              </Label>
              <Input
                id="editName"
                value={currentCasual?.name || ''}
                onChange={(e) => setCurrentCasual(prev => prev ? { ...prev, name: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editEmail" className="text-right">
                Email
              </Label>
              <Input
                id="editEmail"
                type="email"
                value={currentCasual?.email || ''}
                onChange={(e) => setCurrentCasual(prev => prev ? { ...prev, email: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editPhone" className="text-right">
                Phone
              </Label>
              <Input
                id="editPhone"
                type="tel"
                value={currentCasual?.phone || ''}
                onChange={(e) => setCurrentCasual(prev => prev ? { ...prev, phone: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCasual}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CasualTeacherManager;
