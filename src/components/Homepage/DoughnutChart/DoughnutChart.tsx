import { FC } from 'react';
import { shades } from '../colors';
import { PieChart } from '@mui/x-charts';
import { NoExpensesWrapper } from '../../Expenses/ExpenseDetail/ExpenseDetails.styled';
import { TbFaceIdError } from 'react-icons/tb';
import { toTitleCase } from '../../../services/State';

interface Expense {
    cost: number;
    noOfTransactions: number;
    category: string;
    percent: number;
}

interface Props {
    expenses: Expense[];
}

const DonutChart: FC<Props> = ({ expenses }) => {
    const data = expenses.map((expense) => ({
        name: toTitleCase(expense.category) || '',
        value: typeof expense.percent === 'number' ? expense.percent : 0,
        label: toTitleCase(expense.category) || ''
    }));

    return (
        <>
            {expenses && expenses.length == 0 && (
                <NoExpensesWrapper>
                    <TbFaceIdError style={{ fontSize: 'xx-large' }}></TbFaceIdError>
                    <h6>No data found!</h6>
                </NoExpensesWrapper>
            )}
            {expenses && expenses.length > 0 && (
                <div style={{ height: '20rem', width: '20rem' }}>
                    <PieChart
                        colors={shades}
                        series={[
                            {
                                data: data,
                                valueFormatter: (v: any) => {
                                    return `${v.value.toFixed(2)}%`;
                                },
                                innerRadius: 50,
                                outerRadius: 100,
                                paddingAngle: 0,
                                cornerRadius: 3,
                                startAngle: 0,
                                endAngle: 360,
                                cx: 150,
                                cy: 150,
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            }
                        ]}
                        slotProps={{
                            legend: {
                                direction: 'row',
                                position: {
                                    vertical: 'bottom',
                                    horizontal: 'middle',
                                },
                                itemMarkWidth: 20,
                                itemMarkHeight: 2,
                                markGap: 5,
                                itemGap: 10,
                                labelStyle: {
                                    fontSize: 14,
                                    fill: 'black',
                                },
                                hidden: true
                            }
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default DonutChart;
