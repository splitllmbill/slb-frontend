import { FC, useState } from 'react';
import { EventsWrapper } from './Events.styled';

interface EventsProps {}

const Events: FC<EventsProps> = () => {
  const [totalOwe, setTotalOwe] = useState(0);
  const [groups, setGroups] = useState<any[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newExpense, setNewExpense] = useState({ groupName: '', amount: 0 });

  const handleAddGroup = () => {
    if (newGroupName.trim() === '') return;

    const newGroup = { name: newGroupName, total: 0, expenses: [] };
    setGroups([...groups, newGroup]);
    setNewGroupName('');
  };

  const handleAddExpense = () => {
    if (newExpense.groupName.trim() === '' || newExpense.amount <= 0) return;

    const updatedGroups = groups.map((group) => {
      if (group.name === newExpense.groupName) {
        group.total += newExpense.amount;
        group.expenses.push({ amount: newExpense.amount });
      }
      return group;
    });

    setGroups(updatedGroups);
    setTotalOwe(totalOwe + newExpense.amount);
    setNewExpense({ groupName: '', amount: 0 });
  };

  return (
    <EventsWrapper>
      <div>
        <h1>Total I Owe: ${totalOwe}</h1>

        <h2>Groups</h2>
        <ul>
          {groups.map((group) => (
            <li key={group.name}>
              {group.name} - Total: ${group.total}
              <ul>
                {group.expenses.map((expense: any, index: any) => (
                  <li key={index}>Expense: ${expense.amount}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div>
          <button onClick={handleAddGroup}>Add New Group</button>
          <input
            type="text"
            placeholder="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
        </div>

        <div>
          <button onClick={handleAddExpense}>Add New Expense</button>
          <select
            value={newExpense.groupName}
            onChange={(e) => setNewExpense({ ...newExpense, groupName: e.target.value })}
          >
            <option value="" disabled>
              Select Group
            </option>
            {groups.map((group) => (
              <option key={group.name} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
          />
        </div>
      </div>
    </EventsWrapper>
  );
};

export default Events;
