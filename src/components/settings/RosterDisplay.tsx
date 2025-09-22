import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const RosterDisplay = () => {
  const { state } = useContext(AppContext);
  const { rffRoster, teachers, dutySlots } = state;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-teachers">
        <AccordionTrigger>Teachers Data</AccordionTrigger>
        <AccordionContent>
          {teachers.length > 0 ? (
            <div className="overflow-x-auto">
              <pre className="bg-gray-100 p-4 rounded-md text-xs whitespace-pre-wrap">
                {JSON.stringify(teachers, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No Teachers data loaded yet.</p>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-rff-roster">
        <AccordionTrigger>RFF Roster Data</AccordionTrigger>
        <AccordionContent>
          {rffRoster.length > 0 ? (
            <div className="overflow-x-auto">
              <pre className="bg-gray-100 p-4 rounded-md text-xs whitespace-pre-wrap">
                {JSON.stringify(rffRoster, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No RFF Roster data loaded yet.</p>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-duties">
        <AccordionTrigger>Duties Data</AccordionTrigger>
        <AccordionContent>
          {dutySlots.length > 0 ? (
            <div className="overflow-x-auto">
              <pre className="bg-gray-100 p-4 rounded-md text-xs whitespace-pre-wrap">
                {JSON.stringify(dutySlots, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No Duties data loaded yet.</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default RosterDisplay;
