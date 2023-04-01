import * as React from 'react';
import {Box, styled} from '@mui/material';

const StyledBox = styled(Box)<{borderColor: string}>`
  padding: 10px;
  border: 1px solid ${({borderColor}) => borderColor};
  border-radius: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 147px;
  cursor: pointer;
  user-select: none;
`;

const FakeNode = ({borderColor}:{borderColor:string}) => {

    return (
        <StyledBox borderColor={borderColor}>
            B2C Rubber transmitting Puerto fweffwe fwe fwe fwe fwe fw efwe f wef
        </StyledBox>
    );
};

export default FakeNode;
