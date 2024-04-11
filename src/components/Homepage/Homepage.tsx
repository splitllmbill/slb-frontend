import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HomepageContainer, Item, SmallBox, BigBox, BoxContent } from './Homepage.styled';
import { TbUsersGroup } from "react-icons/tb";
import { LuWallet } from "react-icons/lu";
import { FaChevronRight } from "react-icons/fa";
import DonutChart from './DoughnutChart/DoughnutChart';
import DateFilterDropdown from './DateFilterDropdown';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Flex } from '../../App.styled';
import CategorywisePersonalExpenses from './CategorywisePersonalExpenses/CategorywisePersonalExpenses';
import dataService from '../../services/DataService';

interface SummaryState {
  group_expenses: number;
  personal_expenses: number;
  total_you_owe: number;
  total_owed_to_you: number;
}

const Homepage: React.FC = () => {

  const isMobile: boolean = window.innerWidth <= 650;
  const [summary, setSummary] = useState<SummaryState>({
    group_expenses: 0,
    personal_expenses: 0,
    total_you_owe: 0,
    total_owed_to_you: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dataService.getSummaryOfExpenses();
        console.log(data);
        
      } catch (error) {
        // Handle errors if needed
      }
    };

    fetchData(); // Initial data fetch

  }, []);


  return (
    <HomepageContainer>
      <div className='app'>
        <Container>
          <br />
          <Row>
            <Col xs={6}>
              <h3>Welcome, Saroja! {isMobile}</h3>
              <h6>Here's a snapshot of your expenditures.</h6>
            </Col>
            <Col xs={3}></Col>
            <Col xs={3} className="text-end" >
              <DateFilterDropdown></DateFilterDropdown>
            </Col>
          </Row>
          <br />

          <div>
            <Row>
              <Col xs={12} sm={4}>
                <SmallBox>
                  <BoxContent>
                    <Row>
                      <Col xs={6}>
                        <LuWallet style={{ fontSize: 'x-large' }} />
                      </Col>
                      <Col xs={6} className="text-end" >
                        <FaChevronRight style={{ fontSize: 'x-large' }} />
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <h5>Personal Expenses</h5>
                      <b>Rs.5000</b>
                    </Row>
                  </BoxContent>
                </SmallBox>
              </Col>
              {isMobile && <Col xs={12}><br /></Col>}
              <Col xs={12} sm={4}>
                <SmallBox>
                  <BoxContent>
                    <Row>
                      <Col xs={6}>
                        <TbUsersGroup style={{ fontSize: 'x-large' }}></TbUsersGroup>
                      </Col>
                      <Col xs={6} className="text-end" >
                        <FaChevronRight style={{ fontSize: 'x-large' }} />
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <h5>Shared expenses</h5>
                      <b>Rs.5000</b>
                    </Row>
                  </BoxContent>
                </SmallBox>
              </Col>
              {isMobile && <Col xs={12}><br /></Col>}
              <Col xs={12} sm={4}>
                <SmallBox>
                  <BoxContent>
                    <Flex>
                      <MdOutlineKeyboardDoubleArrowRight style={{ fontSize: 'x-large' }} /><h5> Totally, you owe Rs.400</h5>
                    </Flex>
                    <Flex>
                      <MdOutlineKeyboardDoubleArrowRight style={{ fontSize: 'x-large' }} /><h5> Totally, you are owed Rs.4560</h5>
                    </Flex>
                  </BoxContent>
                </SmallBox>
              </Col>
            </Row>
            <br />

            <BigBox>
              <BoxContent>
                <Row>
                  <Col xs={12} md={7}>
                    <Item>
                      <BoxContent>
                        <Row>
                          <Col xs={12} className="d-flex align-items-center">
                            <h5>Personal Expenses</h5>
                          </Col>
                        </Row>
                        <Row className="justify-content-center">
                          <DonutChart />
                        </Row>
                      </BoxContent>
                    </Item>
                  </Col>
                  <Col xs={12} md={5}>
                    <Item>
                      <CategorywisePersonalExpenses />
                    </Item>
                  </Col>
                </Row>
              </BoxContent>
            </BigBox>
          </div>
        </Container>
      </div >
    </HomepageContainer >
  );
};

export default Homepage;
