import DebtTable from '../components/rff-payback/DebtTable';
import PaymentHistoryTable from '../components/rff-payback/PaymentHistoryTable';
import ManualEntryForm from '../components/rff-payback/ManualEntryForm';
import DebtSummaryCards from '../components/rff-payback/DebtSummaryCards';

const RFFPaybackPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">RFF Payback Management - TOTAL DUMMY PAGE</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Current Debts</h2>
          <DebtTable />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Payment History</h2>
          <PaymentHistoryTable />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Manual Debt Entry</h2>
        <ManualEntryForm />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Debt Summary</h2>
        <DebtSummaryCards />
      </div>
    </div>
  );
};

export default RFFPaybackPage;
