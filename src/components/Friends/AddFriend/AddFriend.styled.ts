import { styled } from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Input = styled.input`
    padding: 0.5rem;
    margin-bottom: 1rem;
`;

const Button = styled.button`
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const Alert = styled.div`
    padding: 0.5rem;
    background-color: #28a745;
    color: #fff;
    border-radius: 4px;
    margin-top: 1rem;
`;
