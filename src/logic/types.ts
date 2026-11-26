export type Cents = number;
export interface Participant { id: string; name: string }
export interface Expense {
  id: string;
  description: string;
  amount: Cents;            // > 0
  payerId: string;
  participantIds: string[]; // no vacío
}
export interface EventState {
  version: 1;
  name: string;
  participants: Participant[];
  expenses: Expense[];
}
export interface Transfer { from: string; to: string; amount: Cents } // ids
