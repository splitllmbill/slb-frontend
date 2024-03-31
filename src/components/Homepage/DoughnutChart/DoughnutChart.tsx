import { PieChart } from '@mui/x-charts';
import { generatePalette } from '../../../services/State';

const DonutChart = () => {

    const data = [
        { name: 'A', value: 30, label: 'Transportation' },
        { name: 'B', value: 20, label: 'Petrol' },
        { name: 'C', value: 50, label: 'Entertjklasjksjaksjaksjkajskasjkajskasjakjainment' }
    ];
    const palette = generatePalette(data.length);

    return (

        <div style={{ height: '300px', width: '300px' }}>
            <PieChart
                colors={palette}
                series={[
                    {
                        data: data,
                        innerRadius: 50,
                        outerRadius: 100,
                        paddingAngle: 1,
                        cornerRadius: 3,
                        startAngle: 0,
                        endAngle: 360,
                        cx: 150,
                        cy: 150,
                        highlightScope: { faded: 'global', highlighted: 'item' },
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
    )
};

export default DonutChart;
