import { FC, useEffect, useState } from 'react';
import { EventsWrapper, NoExpensesWrapper } from './Events.styled';
import { MdOutlineGroupAdd } from "react-icons/md";
import EventCard from './EventCard/EventCard';
import dataService from '../../services/DataService';
import { List } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { TbFaceIdError } from "react-icons/tb";
import NonGroupExpenseCard from './EventCard/NonGroupExpenseCard';


interface EventsProps {
  currentEventID: string,
}

const Events: FC<EventsProps> = () => {
  const [events, setEvents] = useState<EventsObject>({
    overallOweAmount: 0,
    owingPerson: "",
    events: []
  });
  const [showEvents, setShowEvents] = useState(false);
  const [nonGroupExpenses, setNonGroupExpenses] = useState({
    "overallYouOwe": 0,
    "overallYouAreOwed": 0,
    "friendsList": []
  });
  const [owingPerson, setOwingPerson] = useState("");
  const [oweAmount, setOweAmount] = useState<number>(0);

  const fetchData = async () => {
    try {
      await dataService.getUserEvents()
        .then(data => {
          setEvents(data);
          dataService.getNonGroupExpenses()
            .then(data => {
              setNonGroupExpenses(data);
              calculateAmount(events.overallOweAmount, events.owingPerson, nonGroupExpenses.overallYouAreOwed, nonGroupExpenses.overallYouOwe);
              setShowEvents(true);
            });
        });
    } catch (error) {
      console.log("Error occurred");
    }

    const calculateAmount = (eventOweAmount: number, eventOwePerson: string, nonGroupOwed: number, nonGroupOwe: number) => {
      let friend_owe = 0;
      let user_owe = 0;
      eventOwePerson === 'friend' ? friend_owe += eventOweAmount : user_owe += eventOweAmount;
      friend_owe += nonGroupOwed;
      user_owe += nonGroupOwe;
      setOweAmount(Math.abs(friend_owe - user_owe));
      setOwingPerson((friend_owe > user_owe) ? "friend" : "user");
      console.log("amount", friend_owe, user_owe, oweAmount, owingPerson);

    }
  }
  useEffect(() => {
    fetchData();
  }, [setEvents, oweAmount, owingPerson]);// Initial data fetch

  const navigate = useNavigate();
  const handleCreateEvent = () => {
    navigate(`/createEvent`);
  };

  return (
    <EventsWrapper>
      <>
        <button onClick={handleCreateEvent}>Create Event <MdOutlineGroupAdd style={{ fontSize: 'x-large' }}></MdOutlineGroupAdd></button>
        {!showEvents && (<div className="d-flex justify-content-center align-items-center"><CircularProgress color="secondary" variant="indeterminate" /></div>)}
        {showEvents && events && events?.events.length > 0 && (
          <>
            {owingPerson == 'user' && (<h2>Totally, you owe Rs.{oweAmount}</h2>)}
            {owingPerson == 'friend' && (<h2>Totally, you are owed Rs.{oweAmount}</h2>)}
            <br></br>
            <List>
              {events?.events?.map((event) => (
                <div key={event.id}>
                  <EventCard eventSent={event}></EventCard>
                </div>
              ))}
              <NonGroupExpenseCard expenses={nonGroupExpenses}></NonGroupExpenseCard>
            </List>
          </>)}
        {showEvents && events && events?.events.length == 0 && (
          <NoExpensesWrapper>
            <TbFaceIdError style={{ fontSize: 'xx-large' }}></TbFaceIdError>
            <h6>No events yet!</h6>
          </NoExpensesWrapper>)}
      </>
    </EventsWrapper>
  );
};

export default Events;
