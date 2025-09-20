import { parse, isWithinInterval, addWeeks, startOfWeek, endOfWeek, isSameDay } from 'date-fns';

interface TermPeriod {
    startDate: Date;
    endDate: Date;
    type: 'term' | 'holiday' | 'development';
    term?: number;
    week?: number;
    description: string;
}

// Manually parsed and structured term data from the provided CSV
const termPeriods: TermPeriod[] = [
    // Term 1
    { startDate: parse('31/01/2025', 'dd/MM/yyyy', new Date()), endDate: parse('31/01/2025', 'dd/MM/yyyy', new Date()), type: 'development', description: 'School development day (Eastern division)' },
    { startDate: parse('3/02/2025', 'dd/MM/yyyy', new Date()), endDate: parse('7/02/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 1, week: 2, description: 'Term 1 Week 2 (11 Wk Term)' }, // Assuming Week 1 is 31/01/2025
    { startDate: parse('10/02/2025', 'dd/MM/yyyy', new Date()), endDate: parse('14/02/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 1, week: 3, description: 'Term 1 Week 3 (11 Wk Term)' },
    { startDate: parse('17/02/2025', 'dd/MM/yyyy', new Date()), endDate: parse('21/02/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 1, week: 4, description: 'Term 1 Week 4 (11 Wk Term)' },
    { startDate: parse('24/02/2025', 'dd/MM/yyyy', new Date()), endDate: parse('28/02/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 1, week: 5, description: 'Term 1 Week 5 (11 Wk Term)' },
    { startDate: parse('3/03/2025', 'dd/MM/yyyy', new Date()), endDate: parse('7/03/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 1, week: 6, description: 'Term 1 Week 6 (11 Wk Term)' },
    { startDate: parse('10/03/2025', 'dd/MM/yyyy', new Date()), endDate: parse('14/03/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 1, week: 7, description: 'Term 1 Week 7 (11 Wk Term)' },
    { startDate: parse('17/03/2025', 'dd/MM/yyyy', new Date()), endDate: parse('21/03/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 1, week: 8, description: 'Term 1 Week 8 (11 Wk Term)' },
    { startDate: parse('24/03/2025', 'dd/MM/yyyy', new Date()), endDate: parse('28/03/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 1, week: 9, description: 'Term 1 Week 9 (11 Wk Term)' },
    { startDate: parse('31/03/2025', 'dd/MM/yyyy', new Date()), endDate: parse('4/04/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 1, week: 10, description: 'Term 1 Week 10 (11 Wk Term)' },
    { startDate: parse('7/04/2025', 'dd/MM/yyyy', new Date()), endDate: parse('11/04/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 1, week: 11, description: 'Term 1 Week 11 (11 Wk Term)' },
    { startDate: parse('14/04/2025', 'dd/MM/yyyy', new Date()), endDate: parse('24/04/2025', 'dd/MM/yyyy', new Date()), type: 'holiday', description: 'School Holidays' },

    // Term 2
    { startDate: parse('28/04/2025', 'dd/MM/yyyy', new Date()), endDate: parse('29/04/2025', 'dd/MM/yyyy', new Date()), type: 'development', description: 'School development day' },
    { startDate: parse('30/04/2025', 'dd/MM/yyyy', new Date()), endDate: parse('2/05/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 2, week: 1, description: 'Term 2 Week 1 (10 Wk Term)' },
    { startDate: parse('5/05/2025', 'dd/MM/yyyy', new Date()), endDate: parse('9/05/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 2, week: 2, description: 'Term 2 Week 2 (10 Wk Term)' },
    { startDate: parse('12/05/2025', 'dd/MM/yyyy', new Date()), endDate: parse('16/05/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 2, week: 3, description: 'Term 2 Week 3 (10 Wk Term)' },
    { startDate: parse('19/05/2025', 'dd/MM/yyyy', new Date()), endDate: parse('23/05/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 2, week: 4, description: 'Term 2 Week 4 (10 Wk Term)' },
    { startDate: parse('26/05/2025', 'dd/MM/yyyy', new Date()), endDate: parse('30/05/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 2, week: 5, description: 'Term 2 Week 5 (10 Wk Term)' },
    { startDate: parse('2/06/2025', 'dd/MM/yyyy', new Date()), endDate: parse('6/06/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 2, week: 6, description: 'Term 2 Week 6 (10 Wk Term)' },
    { startDate: parse('9/06/2025', 'dd/MM/yyyy', new Date()), endDate: parse('13/06/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 2, week: 7, description: 'Term 2 Week 7 (10 Wk Term)' },
    { startDate: parse('16/06/2025', 'dd/MM/yyyy', new Date()), endDate: parse('20/06/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 2, week: 8, description: 'Term 2 Week 8 (10 Wk Term)' },
    { startDate: parse('23/06/2025', 'dd/MM/yyyy', new Date()), endDate: parse('27/06/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 2, week: 9, description: 'Term 2 Week 9 (10 Wk Term)' },
    { startDate: parse('30/06/2025', 'dd/MM/yyyy', new Date()), endDate: parse('4/07/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 2, week: 10, description: 'Term 2 Week 10 (10 Wk Term)' },
    { startDate: parse('7/07/2025', 'dd/MM/yyyy', new Date()), endDate: parse('18/07/2025', 'dd/MM/yyyy', new Date()), type: 'holiday', description: 'School Holidays' },

    // Term 3
    { startDate: parse('21/07/2025', 'dd/MM/yyyy', new Date()), endDate: parse('21/07/2025', 'dd/MM/yyyy', new Date()), type: 'development', description: 'School development day' },
    { startDate: parse('22/07/2025', 'dd/MM/yyyy', new Date()), endDate: parse('25/07/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 3, week: 1, description: 'Term 3 Week 1 (10 Wk Term)' },
    { startDate: parse('28/07/2025', 'dd/MM/yyyy', new Date()), endDate: parse('1/08/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 3, week: 2, description: 'Term 3 Week 2 (10 Wk Term)' },
    { startDate: parse('4/08/2025', 'dd/MM/yyyy', new Date()), endDate: parse('8/08/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 3, week: 3, description: 'Term 3 Week 3 (10 Wk Term)' },
    { startDate: parse('11/08/2025', 'dd/MM/yyyy', new Date()), endDate: parse('15/08/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 3, week: 4, description: 'Term 3 Week 4 (10 Wk Term)' },
    { startDate: parse('18/08/2025', 'dd/MM/yyyy', new Date()), endDate: parse('22/08/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 3, week: 5, description: 'Term 3 Week 5 (10 Wk Term)' },
    { startDate: parse('25/08/2025', 'dd/MM/yyyy', new Date()), endDate: parse('29/08/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 3, week: 6, description: 'Term 3 Week 6 (10 Wk Term)' },
    { startDate: parse('1/09/2025', 'dd/MM/yyyy', new Date()), endDate: parse('5/09/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 3, week: 7, description: 'Term 3 Week 7 (10 Wk Term)' },
    { startDate: parse('8/09/2025', 'dd/MM/yyyy', new Date()), endDate: parse('12/09/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 3, week: 8, description: 'Term 3 Week 8 (10 Wk Term)' },
    { startDate: parse('15/09/2025', 'dd/MM/yyyy', new Date()), endDate: parse('19/09/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 3, week: 9, description: 'Term 3 Week 9 (10 Wk Term)' },
    { startDate: parse('22/09/2025', 'dd/MM/yyyy', new Date()), endDate: parse('26/09/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 3, week: 10, description: 'Term 3 Week 10 (10 Wk Term)' },
    { startDate: parse('29/09/2025', 'dd/MM/yyyy', new Date()), endDate: parse('10/10/2025', 'dd/MM/yyyy', new Date()), type: 'holiday', description: 'School Holidays' },

    // Term 4
    { startDate: parse('13/10/2025', 'dd/MM/yyyy', new Date()), endDate: parse('13/10/2025', 'dd/MM/yyyy', new Date()), type: 'development', description: 'School development day' },
    { startDate: parse('14/10/2025', 'dd/MM/yyyy', new Date()), endDate: parse('17/10/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 4, week: 1, description: 'Term 4 Week 1 (10 Wk Term)' },
    { startDate: parse('20/10/2025', 'dd/MM/yyyy', new Date()), endDate: parse('24/10/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 4, week: 2, description: 'Term 4 Week 2 (10 Wk Term)' },
    { startDate: parse('27/10/2025', 'dd/MM/yyyy', new Date()), endDate: parse('31/10/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 4, week: 3, description: 'Term 4 Week 3 (10 Wk Term)' },
    { startDate: parse('3/11/2025', 'dd/MM/yyyy', new Date()), endDate: parse('7/11/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 4, week: 4, description: 'Term 4 Week 4 (10 Wk Term)' },
    { startDate: parse('10/11/2025', 'dd/MM/yyyy', new Date()), endDate: parse('14/11/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 4, week: 5, description: 'Term 4 Week 5 (10 Wk Term)' },
    { startDate: parse('17/11/2025', 'dd/MM/yyyy', new Date()), endDate: parse('21/11/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 4, week: 6, description: 'Term 4 Week 6 (10 Wk Term)' },
    { startDate: parse('24/11/2025', 'dd/MM/yyyy', new Date()), endDate: parse('28/11/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 4, week: 7, description: 'Term 4 Week 7 (10 Wk Term)' },
    { startDate: parse('1/12/2025', 'dd/MM/yyyy', new Date()), endDate: parse('5/12/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 4, week: 8, description: 'Term 4 Week 8 (10 Wk Term)' },
    { startDate: parse('8/12/2025', 'dd/MM/yyyy', new Date()), endDate: parse('12/12/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 4, week: 9, description: 'Term 4 Week 9 (10 Wk Term)' },
    { startDate: parse('15/12/2025', 'dd/MM/yyyy', new Date()), endDate: parse('19/12/2025', 'dd/MM/yyyy', new Date()), type: 'term', term: 4, week: 10, description: 'Term 4 Week 10 (10 Wk Term)' },
    { startDate: parse('22/12/2025', 'dd/MM/yyyy', new Date()), endDate: parse('26/01/2026', 'dd/MM/yyyy', new Date()), type: 'holiday', description: 'School Holidays (Eastern division)' },
];

export function getTermAndWeek(date: Date): { term?: number; week?: number; type: 'term' | 'holiday' | 'development'; description: string } {
    const period = termPeriods.find(p => isWithinInterval(date, { start: p.startDate, end: p.endDate }));

    if (period) {
        if (period.type === 'term' && period.term && period.week) {
            // For term weeks, we need to calculate the exact week number based on the start of the term.
            // The CSV provides week numbers, but they are for the start of the week.
            // We'll use the provided week number directly for simplicity, assuming the CSV is accurate for week boundaries.
            return { term: period.term, week: period.week, type: 'term', description: period.description };
        } else {
            return { type: period.type, description: period.description };
        }
    }

    // If no specific period is found, it might be an unlisted holiday or outside the defined range.
    return { type: 'holiday', description: "Unknown Holiday/Break" };
}
