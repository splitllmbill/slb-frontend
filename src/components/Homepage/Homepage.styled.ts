import { Paper } from "@mui/material";
import { styled } from "styled-components";

export const Item = styled(Paper)(({ }) => ({
  borderRadius: '10px',
  background: '#fff',
  minWidth: '100px',
  minHeight: '480px',
  boxShadow:'none'
}));

export const SmallBox = styled(Paper)(({ }) => ({
  borderRadius: '10px',
  minWidth: '100px',
  minHeight: '150px',
  boxShadow:'none'
}));

export const BigBox = styled(Paper)(({ }) => ({
  borderRadius: '10px',
  width: '100%',
  '&.MuiPaper-root': {
    background: '#dcdcdc',
  },
  boxShadow:'none'
}));

export const BoxContent = styled.div`
padding: 20px;
`

export const HomepageContainer = styled.div`
padding: 10px;
`
