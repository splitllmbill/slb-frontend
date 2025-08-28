import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HomepageContainer, ModernCard, StatsCard, ChartCard, WelcomeSection } from './Homepage.styled';
import { TbUsersGroup, TbTrendingUp, TbWallet, TbChartPie } from "react-icons/tb";
import { LuWallet, LuArrowUpRight, LuArrowDownRight } from "react-icons/lu";
import { FaChevronRight } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";
import DonutChart from './DoughnutChart/DoughnutChart';
import DateFilterDropdown from './DateFilterDropdown';
import CategorywisePersonalExpenses from './CategorywisePersonalExpenses/CategorywisePersonalExpenses';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../services/State';
import dataService from '../../services/DataService';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography, Chip } from '@mui/material';

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

  const redirectToFriends = () => {
    navigate('/friends')
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const netBalance = summary.total_owed_to_you - summary.total_you_owe;

  return (
    <HomepageContainer>
      <div className='app'>
        <Container fluid>
          {summary.username !== '' && (
            <WelcomeSection>
              <Row className="align-items-center">
                <Col xs={12} lg={8}>
                  <div className="welcome-content">
                    <div className="greeting-section">
                      <HiOutlineSparkles className="sparkle-icon" />
                      <h1 className="greeting-text">
                        {getGreeting()}, {summary.username}!
                      </h1>
                    </div>
                    <p className="welcome-subtitle">
                      Here's your financial overview and spending insights
                    </p>
                  </div>
                </Col>
                <Col xs={12} lg={4} className="text-end">
                  <div className="date-filter-wrapper">
                    <DateFilterDropdown setDateRange={handleDateChange} />
                  </div>
                </Col>
              </Row>
              
              <Row className="mt-3">
                <Col xs={12} className="text-center">
                  <div className="date-range-display">
                    {dateRange.startDate && dateRange.endDate ? (
                      <Chip 
                        label={`${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`}
                        variant="outlined"
                        className="date-chip"
                      />
                    ) : (
                      <Chip 
                        label="All time data"
                        variant="outlined"
                        className="date-chip"
                      />
                    )}
                  </div>
                </Col>
              </Row>
            </WelcomeSection>
          )}

          {!showSummary && (
            <div className="loading-container">
              <CircularProgress color="secondary" variant="indeterminate" />
              <Typography variant="h6" className="loading-text">Loading your dashboard...</Typography>
            </div>
          )}

          {showSummary && (
            <>
              {/* Stats Cards */}
              <Row className="stats-row">
                <Col xs={12} md={6} lg={3}>
                  <StatsCard onClick={redirectToPersonalExpense} className="personal-card">
                    <div className="card-header">
                      <div className="icon-wrapper personal">
                        <LuWallet />
                      </div>
                      <FaChevronRight className="arrow-icon" />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">Personal Expenses</h3>
                      <div className="amount">₹{summary.personal_expenses.toFixed(2)}</div>
                      <div className="card-subtitle">Your spending</div>
                    </div>
                  </StatsCard>
                </Col>

                <Col xs={12} md={6} lg={3}>
                  <StatsCard onClick={redirectToEvents} className="shared-card">
                    <div className="card-header">
                      <div className="icon-wrapper shared">
                        <TbUsersGroup />
                      </div>
                      <FaChevronRight className="arrow-icon" />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">Shared Expenses</h3>
                      <div className="amount">₹{summary.group_expenses.toFixed(2)}</div>
                      <div className="card-subtitle">Group spending</div>
                    </div>
                  </StatsCard>
                </Col>

                <Col xs={12} md={6} lg={3}>
                  <StatsCard onClick={redirectToFriends} className="owe-card">
                    <div className="card-header">
                      <div className="icon-wrapper owe">
                        <LuArrowUpRight />
                      </div>
                      <FaChevronRight className="arrow-icon" />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">You Owe</h3>
                      <div className="amount owe-amount">₹{summary.total_you_owe.toFixed(2)}</div>
                      <div className="card-subtitle">To friends</div>
                    </div>
                  </StatsCard>
                </Col>

                <Col xs={12} md={6} lg={3}>
                  <StatsCard onClick={redirectToFriends} className="owed-card">
                    <div className="card-header">
                      <div className="icon-wrapper owed">
                        <LuArrowDownRight />
                      </div>
                      <FaChevronRight className="arrow-icon" />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">You're Owed</h3>
                      <div className="amount owed-amount">₹{summary.total_owed_to_you.toFixed(2)}</div>
                      <div className="card-subtitle">From friends</div>
                    </div>
                  </StatsCard>
                </Col>
              </Row>

              {/* Net Balance Card */}
              <Row className="balance-row">
                <Col xs={12}>
                  <ModernCard className="balance-card">
                    <div className="balance-content">
                      <div className="balance-header">
                        <TbTrendingUp className="balance-icon" />
                        <h3>Net Balance</h3>
                      </div>
                      <div className={`balance-amount ${netBalance >= 0 ? 'positive' : 'negative'}`}>
                        {netBalance >= 0 ? '+' : ''}₹{netBalance.toFixed(2)}
                      </div>
                      <p className="balance-description">
                        {netBalance >= 0 
                          ? "You're in a good position! Others owe you more than you owe them."
                          : "You have some outstanding payments to settle."
                        }
                      </p>
                      <Typography variant="caption" className="balance-note">
                        * Date range does not apply to balance calculations
                      </Typography>
                    </div>
                  </ModernCard>
                </Col>
              </Row>
            </>
          )}

          {showChart && expenses.length > 0 && (
            <Row className="chart-row">
              <Col xs={12} lg={7}>
                <ChartCard>
                  <div className="chart-header">
                    <div className="chart-title-section">
                      <TbChartPie className="chart-icon" />
                      <h3>Expense Breakdown</h3>
                    </div>
                    <div className="chart-subtitle">
                      Personal expenses by category
                    </div>
                  </div>
                  <div className="chart-content">
                    <DonutChart expenses={expenses} />
                  </div>
                </ChartCard>
              </Col>
              
              <Col xs={12} lg={5}>
                <ChartCard>
                  <div className="chart-header">
                    <div className="chart-title-section">
                      <TbWallet className="chart-icon" />
                      <h3>Category Details</h3>
                    </div>
                    <div className="chart-subtitle">
                      Detailed breakdown
                    </div>
                  </div>
                  <div className="category-content">
                    <CategorywisePersonalExpenses expenses={expenses} />
                  </div>
                </ChartCard>
              </Col>
            </Row>
          )}

          {showChart && expenses.length === 0 && (
            <Row className="empty-state-row">
              <Col xs={12}>
                <ModernCard className="empty-state">
                  <div className="empty-content">
                    <TbChartPie className="empty-icon" />
                    <h3>No expense data available</h3>
                    <p>Start adding your expenses to see detailed analytics and insights.</p>
                  </div>
                </ModernCard>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </HomepageContainer>
  );
};

export default Homepage;
