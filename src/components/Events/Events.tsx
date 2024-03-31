import { FC, useEffect, useState } from 'react';
import { MdOutlineGroupAdd } from "react-icons/md";
import EventCard from './EventCard/EventCard';
import dataService from '../../services/DataService';
import { List } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { TbFaceIdError } from "react-icons/tb";
import NonGroupExpenseCard from './EventCard/NonGroupExpenseCard';
import { DashboardContainer, NoItemsWrapper } from '../../App.styled';


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
      const eventData = await dataService.getUserEvents();
      const nonGroupExpenseData = await dataService.getNonGroupExpenses();

      setEvents(eventData);
      setNonGroupExpenses(nonGroupExpenseData);

      calculateAmount(eventData.overallOweAmount, eventData.owingPerson, nonGroupExpenseData.overallYouAreOwed, nonGroupExpenseData.overallYouOwe);
      setShowEvents(true);
    } catch (error) {
      console.log("Error occurred:", error);
    }
  }


  const calculateAmount = (eventOweAmount: number, eventOwePerson: string, nonGroupOwed: number, nonGroupOwe: number) => {
    let friend_owe = 0;
    let user_owe = 0;
    eventOwePerson === 'friend' ? friend_owe += eventOweAmount : user_owe += eventOweAmount;
    friend_owe += nonGroupOwed;
    user_owe += nonGroupOwe;
    setOweAmount(Math.abs(friend_owe - user_owe));
    setOwingPerson((friend_owe > user_owe) ? "friend" : "user");
  }

  useEffect(() => {
    fetchData();
  }, [setEvents, oweAmount, owingPerson]);// Initial data fetch

  const navigate = useNavigate();
  const handleCreateEvent = () => {
    navigate(`/create-event`);
  };

  return (
    <DashboardContainer>
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
          <NoItemsWrapper>
            <TbFaceIdError style={{ fontSize: 'xx-large' }}></TbFaceIdError>
            <h6>No events yet!</h6>
          </NoItemsWrapper>)}
      </>
    </DashboardContainer>
  );
};

export default Events;
