import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RFFDebt } from '../../types';
import React from 'react';

interface RFFTableProps {
  headers: string[];
  data: RFFDebt[];
  renderRow: (debt: RFFDebt) => React.ReactNode;
  emptyMessage: string;
  colSpan: number;
}

const RFFTable: React.FC<RFFTableProps> = ({ headers, data, renderRow, emptyMessage, colSpan }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((debt: RFFDebt) => (
              <TableRow key={debt.id}>
                {renderRow(debt)}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={colSpan} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RFFTable;
