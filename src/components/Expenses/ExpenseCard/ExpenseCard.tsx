import { FC} from 'react';
import { ExpenseCardWrapper } from './ExpenseCard.styled';
import { Card, CardContent, Typography } from '@mui/material';
import { Col, Row } from 'react-bootstrap';
import { toTitleCase } from '../../../services/State';
interface ExpenseCardProps {
   expense: Expense; // Adjust the type as per your EventObject structure
}

const ExpenseCard: FC<ExpenseCardProps> = ({expense}) => {

   const paid = expense.paidBy==localStorage.getItem('userId')
   let owe=0
   let owed=0
   if (paid){
      expense.shares.map((share)=>{
         if(share.userId!==localStorage.getItem('userId'))
            owed+=share.amount
      })
   } else{
      expense.shares.map((share)=>{
         if(share.userId==localStorage.getItem('userId'))
            owe+=share.amount
      })
   }
   return (
        <ExpenseCardWrapper>
          <Card>
            <CardContent>
               <Row>
                  <Col sm={2} className="d-flex justify-content-center align-items-center">
                     <div className="text-left"> {/* Add text-left class for left alignment inside the div */}
                        <Typography variant="h5" component="div">
                           {toTitleCase(expense.expenseName)}
                        </Typography>
                     </div>
                  </Col>
                  <Col sm={5} className="d-flex justify-content-right align-items-right">
                     <div className="text-right"> {/* Add text-left class for left alignment inside the div */}
                     { !paid? 
                        
                        <div>
                           You owe {owe}
                        </div>:<div>  You are owed {owed}</div>
                     }
                     </div>
                  </Col>
               </Row>
            </CardContent>
         </Card>
        </ExpenseCardWrapper>
   );
};

export default ExpenseCard;
