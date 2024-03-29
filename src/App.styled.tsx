import { styled } from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Input = styled.input`
    padding: 0.5rem;
    margin-bottom: 1rem;
`;

export const Button = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

export const DashboardContainer = styled.div`
padding: 20px;
`;

export const Flex = styled.div`
    display: flex;
    gap: 10px;
`;

