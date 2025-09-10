export interface RFFPayback {
  teacher: string;
  slotsOwed: number;
  priority: number;
  notes: string;
}

export const rawRFFPayback: (string | number)[][] = [
    ['Teacher', 'Slots Owed', 'Priority', 'Notes'],
    ['Christine', '2', '1', 'ECT time coverage - 3C odd weeks, 6L even weeks'],
    ['Karen', '1', '2', 'ICT coordinator time - covers 1S for Giuseppe'],
    ['James', '1', '3', 'Sport coverage when no PSSA - flexible arrangement'],
    ['Alice', '1', '4', 'General coverage - various classes as needed'],
    ['Holly', '2', '5', 'ECT time coverage - even weeks only'],
    ['Maz', '1', '6', 'Fed Rep coverage - covers 5H for Gemma'],
    ['Narelle', '1', '7', '4C coverage - even weeks (4-day work week arrangement)']
];

export const getRFFPaybackList = (): RFFPayback[] => {
    return rawRFFPayback.slice(1).map(row => ({
        teacher: row[0] as string,
        slotsOwed: parseInt(row[1] as string) || 0,
        priority: parseInt(row[2] as string) || 999,
        notes: row[3] as string || ''
    })).sort((a, b) => a.priority - b.priority);
};

export const getHighestPriorityPayback = (): RFFPayback | null => {
    const paybackList = getRFFPaybackList();
    return paybackList.length > 0 ? paybackList[0] : null;
};

export const getPaybackForTeacher = (teacherName: string): RFFPayback | null => {
    const paybackList = getRFFPaybackList();
    return paybackList.find(item => item.teacher === teacherName) || null;
};

export const updatePaybackAfterAssignment = (teacherName: string): (string | number)[][] => {
    return rawRFFPayback.map(row => {
        if (row[0] === teacherName) {
            const currentSlots = parseInt(row[1] as string) || 0;
            const newSlots = Math.max(0, currentSlots - 1);
            return [row[0], newSlots.toString(), row[2], row[3]];
        }
        return row;
    });
};

export const addPaybackEntry = (teacherName: string, slotsOwed: number, notes = ''): (string | number)[][] => {
    const currentData = getRFFPaybackList();
    const nextPriority = currentData.length > 0 ? Math.max(...currentData.map(item => item.priority)) + 1 : 1;

    return [
        ...rawRFFPayback,
        [teacherName, slotsOwed.toString(), nextPriority.toString(), notes]
    ];
};

export const getPaybackSummary = (): { totalTeachersOwed: number; totalSlotsOwed: number; highestPriority: string; averageSlotsPerTeacher: string } => {
    const paybackList = getRFFPaybackList();

    return {
        totalTeachersOwed: paybackList.length,
        totalSlotsOwed: paybackList.reduce((sum, item) => sum + item.slotsOwed, 0),
        highestPriority: paybackList[0]?.teacher || 'None',
        averageSlotsPerTeacher: paybackList.length > 0
            ? (paybackList.reduce((sum, item) => sum + item.slotsOwed, 0) / paybackList.length).toFixed(1)
            : '0'
    };
};
