import { Subject } from 'rxjs';

export const personalExpenseAdded = new Subject<void>();

export const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

export function formatDate(dateString: string) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options).replace(/(\d+)(th|st|nd|rd)/, '$1');
}

export function convertTimestampToISO(timestamp) {
    return new Date(timestamp).toISOString();
}

export const formatDateForTransactions = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    const year = date.getFullYear();

    return (
        <div>
            {`${day} ${month}`}
            <br />
            {year}
        </div>
    );
};