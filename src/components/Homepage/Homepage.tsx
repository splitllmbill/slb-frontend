import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HomepageContainer, Item, SmallBox, BoxContent } from './Homepage.styled';
import { TbUsersGroup } from "react-icons/tb";
import { LuWallet } from "react-icons/lu";
import { FaChevronRight } from "react-icons/fa";
import DonutChart from './DoughnutChart/DoughnutChart';
import DateFilterDropdown from './DateFilterDropdown';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Flex } from '../../App.styled';
import CategorywisePersonalExpenses from './CategorywisePersonalExpenses/CategorywisePersonalExpenses';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../services/State';
import dataService from '../../services/DataService';
import CircularProgress from '@mui/material/CircularProgress';

interface SummaryState {
  group_expenses: number;
  personal_expenses: number;
  total_you_owe: number;
  total_owed_to_you: number;
  username: string;
}

interface ChartExpense {
  "cost": number;
  "noOfTransactions": number;
  "category": string;
  "percent": number;
}

const Homepage: React.FC = () => {

  const isMobile: boolean = window.innerWidth <= 650;
  const [summary, setSummary] = useState<SummaryState>({
    group_expenses: 0,
    personal_expenses: 0,
    total_you_owe: 0,
    total_owed_to_you: 0,
    username: ''
  });
  const [expenses, setExpenses] = useState<ChartExpense[]>([]);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null, endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(false);

  const handleDateChange = (obj: React.SetStateAction<{ startDate: Date | null; endDate: Date | null; }>) => {
    setDateRange(obj)
  }

  const fetchData = async () => {
    let requestData = {
      "startDate": dateRange.startDate ? dateRange.startDate.toDateString() : null,
      "endDate": dateRange.endDate ? dateRange.endDate.toDateString() : null
    }
    try {
      await dataService.getSummaryOfExpenses(requestData).then((data) => {
        setSummary(data);
        setShowSummary(true);
      });
    } catch (error) {
      setShowSummary(true);
    }

    try {
      await dataService.getChartData(requestData).then((data) => {
        setExpenses(data);
        setShowChart(true);
      });
    } catch (error) {
      setShowChart(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const navigate = useNavigate();

  const redirectToPersonalExpense = () => {
    navigate('/personal-expenses')
  }

  const redirectToEvents = () => {
    navigate('/events')
  }

  return (
    <HomepageContainer>
      <div className='app'>
        <Container>
          <br />
          {
            summary.username !== '' ? (
              <Row>
                <Col xs={12} sm={9}>
                  <h3>Welcome, {summary.username} ! {isMobile}</h3>
                  <h6>Here's a snapshot of your expenditures.</h6>
                </Col>
                {isMobile && <Col xs={12}><br /></Col>}
                <Col xs={12} sm={3} className="text-end" >
                  <DateFilterDropdown setDateRange={handleDateChange}></DateFilterDropdown>
                </Col>
              </Row>
            ) : <></>
          }
          <br />
          <Row>
            <Col xs={12} className="text-end">
              {dateRange.startDate && dateRange.endDate && <h6>From {formatDate(dateRange.startDate)} to {formatDate(dateRange.endDate)}</h6>}
              {!dateRange.startDate && !dateRange.endDate && <h6>Date Range: All time</h6>}
            </Col>
          </Row>
          <br />
          <div>
            {!showSummary && (<div className="d-flex justify-content-center align-items-center"><CircularProgress color="secondary" variant="indeterminate" /></div>)}
            {showSummary && (<Row>
              <Col sm={12} md={4}>
                <SmallBox>
                  <BoxContent>
                    <Row>
                      <Col xs={6}>
                        <LuWallet style={{ fontSize: 'x-large' }} />
                      </Col>
                      <Col xs={6} className="text-end" onClick={redirectToPersonalExpense}>
                        <FaChevronRight style={{ fontSize: 'x-large' }} />
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <h5>Personal Expenses</h5>
                      <b>Rs.{summary.personal_expenses}</b>
                    </Row>
                  </BoxContent>
                </SmallBox>
              </Col>
              {isMobile && <Col xs={12}><br /></Col>}
              <Col sm={12} md={4}>
                <SmallBox>
                  <BoxContent>
                    <Row>
                      <Col xs={6}>
                        <TbUsersGroup style={{ fontSize: 'x-large' }}></TbUsersGroup>
                      </Col>
                      <Col xs={6} className="text-end" onClick={redirectToEvents}>
                        <FaChevronRight style={{ fontSize: 'x-large' }} />
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <h5>Shared expenses</h5>
                      <b>Rs.{summary.group_expenses}</b>
                    </Row>
                  </BoxContent>
                </SmallBox>
              </Col>
              {isMobile && <Col xs={12}><br /></Col>}
              <Col sm={12} md={4}>
                <SmallBox>
                  <BoxContent>
                    <Flex>
                      <MdOutlineKeyboardDoubleArrowRight style={{ fontSize: 'x-large' }} /><h5> Totally, you owe Rs.{summary.total_you_owe}</h5>
                    </Flex>
                    <Flex>
                      <MdOutlineKeyboardDoubleArrowRight style={{ fontSize: 'x-large' }} /><h5> Totally, you are owed Rs.{summary.total_owed_to_you}</h5>
                    </Flex>
                  </BoxContent>
                </SmallBox>
              </Col>
            </Row>
            )}
            <br />
            {showChart && (
              <Row>
                <Col xs={12} lg={7}>
                  <Item>
                    <BoxContent>
                      <Row>
                        <Col xs={12} className="d-flex align-items-center">
                          <h5>Personal Expenses</h5>
                        </Col>
                      </Row>
                      <Row className="justify-content-center">
                        <DonutChart expenses={expenses} />
                      </Row>
                    </BoxContent>
                  </Item>
                </Col>
                <Col xs={12} className="d-lg-none"><br /></Col>
                <Col xs={12} lg={5}>
                  <Item>
                    <CategorywisePersonalExpenses expenses={expenses} />
                  </Item>
                </Col>
              </Row>
            )}
          </div>
        </Container>
      </div >
    </HomepageContainer >
  );
};

export default Homepage;
