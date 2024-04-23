import { FC} from 'react';
import { ExpenseCardWrapper } from './ExpenseCard.styled';
import { Card, CardContent, Typography } from '@mui/material';
import { Col, Row } from 'react-bootstrap';
 
interface ExpenseCardProps {
   expense: Expense; // Adjust the type as per your EventObject structure
}

const ExpenseCard: FC<ExpenseCardProps> = ({expense}) => {

   const paid = expense.paidBy==localStorage.getItem('userId')
   let owe=0
   let owed=0
   let involved=false
   if (paid){
      expense.shares.map((share)=>{
         if(share.userId!==localStorage.getItem('userId'))
            owed+=share.amount
         else
            involved=true
      })
   } else{
      expense.shares.map((share)=>{
         if(share.userId==localStorage.getItem('userId')){
            owe+=share.amount
            involved=true
         }  
      })
   }
   return (
        <ExpenseCardWrapper>
          <Card>
            <CardContent>
               <Row>
                  <Col sm={7} className="d-flex justify-content-left align-item-left">
                     <div className="text-left"> {/* Add text-left class for left alignment inside the div */}
                        <Typography variant="h6" component="div" sx={{ fontWeight:'bold',textTransform: 'capitalize'}}>
                            {expense.expenseName}
                        </Typography>
                     </div>
                  </Col>
                  <Col sm={5} className="d-flex justify-content-end align-items-center">
                     <div className="text-right"> {/* Change justify-content-right to justify-content-end */}
                        {involved ? !paid ? 
                        <Typography variant="h6" component="div" sx={{ fontWeight:'bold',color: 'red' ,textTransform: 'capitalize'}}>
                           You owe Rs. {owe.toFixed(2)}
                        </Typography>
                        : 
                        <Typography variant="h6" component="div" sx={{ fontWeight:'bold',color: 'green' ,textTransform: 'capitalize'}}>
                           You are owed Rs. {owed.toFixed(2)}
                        </Typography>
                        :"-"}
                     </div>
                  </Col>
               </Row>
            </CardContent>
         </Card>
        </ExpenseCardWrapper>
   );
};

export default ExpenseCard;
