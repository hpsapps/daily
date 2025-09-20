import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import RFFTable from './RFFTable';
import { TableCell } from "@/components/ui/table";
import type { RFFDebt } from '../../types';

const PaymentHistoryTable = () => {
  const { state } = useContext(AppContext);
  const { rffDebts } = state;

  const clearedDebts = rffDebts.filter(debt => debt.dateCleared);

  const headers = ["Teacher ID", "Hours Owed", "Reason", "Date Created", "Date Cleared", "Cleared By"];
  const emptyMessage = "No RFF payment history.";

  const renderPaymentRow = (debt: RFFDebt) => (
    <>
      <TableCell>{debt.teacherId}</TableCell>
      <TableCell>{debt.hoursOwed}</TableCell>
      <TableCell>{debt.reason}</TableCell>
      <TableCell>{debt.dateCreated.toLocaleDateString()}</TableCell>
      <TableCell>{debt.dateCleared?.toLocaleDateString()}</TableCell>
      <TableCell>{debt.clearedBy}</TableCell>
    </>
  );

  return (
    <RFFTable
      headers={headers}
      data={clearedDebts}
      renderRow={renderPaymentRow}
      emptyMessage={emptyMessage}
      colSpan={headers.length}
    />
  );
};

export default PaymentHistoryTable;
