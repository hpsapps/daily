import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import RFFTable from './RFFTable';
import { TableCell } from "@/components/ui/table";
import type { RFFDebt } from '../../types';

const DebtTable = () => {
  const { state } = useContext(AppContext);
  const { rffDebts } = state;

  const headers = ["Teacher ID", "Hours Owed", "Reason", "Date Created"];
  const emptyMessage = "No current RFF debts.";

  const renderDebtRow = (debt: RFFDebt) => (
    <>
      <TableCell>{debt.teacherId}</TableCell>
      <TableCell>{debt.hoursOwed}</TableCell>
      <TableCell>{debt.reason}</TableCell>
      <TableCell>{debt.dateCreated.toLocaleDateString()}</TableCell>
    </>
  );

  return (
    <RFFTable
      headers={headers}
      data={rffDebts}
      renderRow={renderDebtRow}
      emptyMessage={emptyMessage}
      colSpan={headers.length}
    />
  );
};

export default DebtTable;
