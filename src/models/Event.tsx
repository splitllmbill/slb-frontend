interface EventObject {
    id: string;
    users: User[];
    eventName: string;
    totalExpense: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User;
    updatedBy: User;
    expenses: Expense[];
}