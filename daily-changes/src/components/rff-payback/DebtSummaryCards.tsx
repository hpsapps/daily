import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DebtSummaryCards = () => {
  const { state } = useContext(AppContext);
  const { rffDebts } = state;

  const totalHoursOwed = rffDebts
    .filter(debt => !debt.dateCleared)
    .reduce((sum, debt) => sum + debt.hoursOwed, 0);

  const totalClearedHours = rffDebts
    .filter(debt => debt.dateCleared)
    .reduce((sum, debt) => sum + debt.hoursOwed, 0);

  const numberOfActiveDebts = rffDebts.filter(debt => !debt.dateCleared).length;
  const numberOfClearedDebts = rffDebts.filter(debt => debt.dateCleared).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Hours Owed</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHoursOwed.toFixed(1)} hours</div>
          <p className="text-xs text-muted-foreground">
            {numberOfActiveDebts} active debts
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cleared Hours</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClearedHours.toFixed(1)} hours</div>
          <p className="text-xs text-muted-foreground">
            {numberOfClearedDebts} cleared debts
          </p>
        </CardContent>
      </Card>
      {/* Add more cards for other summaries if needed */}
    </div>
  );
};

export default DebtSummaryCards;
