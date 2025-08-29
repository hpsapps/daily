import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RFFDebt } from '../../types';

const DebtTable = () => {
  const { state } = useContext(AppContext);
  const { rffDebts } = state;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Teacher ID</TableHead>
            <TableHead>Hours Owed</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Date Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rffDebts.length > 0 ? (
            rffDebts.map((debt: RFFDebt) => (
              <TableRow key={debt.id}>
                <TableCell>{debt.teacherId}</TableCell>
                <TableCell>{debt.hoursOwed}</TableCell>
                <TableCell>{debt.reason}</TableCell>
                <TableCell>{debt.dateCreated.toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No current RFF debts.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DebtTable;
