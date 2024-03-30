interface Share {
    id?: string;
    name?: string;
    amount: number;
    userId: string; // Reference to a User object
    eventId?: number; // Reference to an Event object
  }
  