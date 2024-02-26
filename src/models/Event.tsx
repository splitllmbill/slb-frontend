interface EventObject {
    id?: string;
    users: string[];
    eventName: string;
    totalExpense: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    expenses: Expense[];
    dues: any;
}