// styled.ts
import styled from 'styled-components';

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px;
`;

export const FilterInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f3f4f6;
  padding: 10px;
  border-radius: 8px;
`;

export const FilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background-color: white;
  &:focus {
    border-color: #6b7280;
    outline: none;
  }
`;

export const RangeInput = styled.input`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  margin: 0 5px;
  width: 100px;
  &:focus {
    border-color: #6b7280;
    outline: none;
  }
`;

export const RemoveButton = styled.button`
  padding: 8px 12px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #dc2626;
  }
`;

export const AddFilterButton = styled.button`
  padding: 10px 15px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #059669;
  }
`;
