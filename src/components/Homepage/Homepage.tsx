import React from 'react';
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


const Homepage: React.FC = () => {

  const isMobile: boolean = window.innerWidth <= 500;

  return (
    <HomepageContainer>
      <div className='app'>
        <Container>
          <Row>
            <Col xs={12}>
              <h3>Welcome, User!{isMobile}</h3>
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
                      <h5>Group expenses</h5>
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
                          <Col xs={6} className="d-flex align-items-center">
                            <h5>Personal Expenses</h5>
                          </Col>
                          <Col xs={6} className="text-end" >
                            <div>
                              <DateFilterDropdown></DateFilterDropdown>
                            </div>
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
