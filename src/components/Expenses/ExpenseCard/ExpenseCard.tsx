import { FC} from 'react';
import { ExpenseCardWrapper } from './ExpenseCard.styled';
import { Card, CardContent, Typography } from '@mui/material';
import { Col, Row } from 'react-bootstrap';
import { toTitleCase } from '../../../services/State';
interface ExpenseCardProps {
   expense: Expense; // Adjust the type as per your EventObject structure
}

const ExpenseCard: FC<ExpenseCardProps> = ({expense}) => {

   return (
        <ExpenseCardWrapper>
          <Card>
            <CardContent>
               <Row>
                  <Col sm={6} className="d-flex justify-content-center align-items-center">
                     <div className="text-left"> {/* Add text-left class for left alignment inside the div */}
                        <Typography variant="h5" component="div">
                           {toTitleCase(expense.expenseName)}
                        </Typography>
                     </div>
                  </Col>

               </Row>
            </CardContent>
         </Card>
         {expense.expenseName}
        </ExpenseCardWrapper>
   );
};

export default ExpenseCard;
