import { Subject } from 'rxjs';

export const personalExpenseAdded = new Subject<void>();

export const generatePalette = (numColors: number) => {
    const palette = [];
    const colorSet = new Set(); // To avoid duplicates

    function generateRandomColor() {
        // Generate random RGB values
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        // Convert RGB to hexadecimal
        const color = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');

        return color;
    }

    while (palette.length < numColors) {
        const color = generateRandomColor();

        // Ensure no duplicates
        if (!colorSet.has(color)) {
            palette.push(color);
            colorSet.add(color);
        }
    }

    return palette;
};

export const toTitleCase = (str: string) => {
    if (str)
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    else return "--";
};

export function formatDate(dateString: any) {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options).replace(/(\d+)(th|st|nd|rd)/, '$1');
}

export const formatDateForTransactions = (dateString: string | number | Date) => {
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

