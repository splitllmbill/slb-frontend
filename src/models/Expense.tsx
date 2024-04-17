interface Expense {
    date: string;
    id?:string;
    expenseName: string;
    amount: number;
    type: string;
    paidBy: string; // Reference to a User object
    shares: Share[]; // List of Share objects
    createdAt: Date;
    updatedAt: Date;
    createdBy: string; // Reference to a User object
    updatedBy: string; // Reference to a User object
    category: string;
    eventId?: string;
    eventName?: string;
}
