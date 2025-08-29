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

const PaymentHistoryTable = () => {
  const { state } = useContext(AppContext);
  const { rffDebts } = state; // Assuming rffDebts will contain both current and cleared debts, with a 'dateCleared' field

  const clearedDebts = rffDebts.filter(debt => debt.dateCleared);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Teacher ID</TableHead>
            <TableHead>Hours Owed</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Date Cleared</TableHead>
            <TableHead>Cleared By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clearedDebts.length > 0 ? (
            clearedDebts.map((debt: RFFDebt) => (
              <TableRow key={debt.id}>
                <TableCell>{debt.teacherId}</TableCell>
                <TableCell>{debt.hoursOwed}</TableCell>
                <TableCell>{debt.reason}</TableCell>
                <TableCell>{debt.dateCreated.toLocaleDateString()}</TableCell>
                <TableCell>{debt.dateCleared?.toLocaleDateString()}</TableCell>
                <TableCell>{debt.clearedBy}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No RFF payment history.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentHistoryTable;
