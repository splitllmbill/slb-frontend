import styled from 'styled-components';

export const Container = styled.div`
    margin:20px;
    padding: 20px;

    @media (max-width: 600px) {
        width: 90%;
    }
`;

export const Label = styled.label`
    display: block;
    margin-bottom: 5px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;


