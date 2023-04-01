import * as React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import {useState} from 'react';
import {Box, styled, Tab, Tabs, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FakeNode from './FakeNode';

const StyledButton = styled(Button)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateY(36px);
  z-index: 10;
  border-radius: 0 0 10px 10px;
  background-color: gray;
  color: white;
  &:hover{
    background-color: darkgray;
  }
`;

const StyledItemsContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  height: 210px;
  overflow: auto;
`;

const StyledMenu = styled(Box)<{showMenu: boolean}>`
  width: 100%;
  align-items:center;
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 10;
  background: #F5F5F5;
  transition: .5s;
  top: ${({showMenu}) => !showMenu ? '-300px' : 0};
`;

const TopDrawer = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [value, setValue] = useState(0);

    return (
        <>
            <StyledMenu showMenu={showMenu}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Tabs value={value} onChange={(_e, newValue) => setValue(newValue)}>
                        <Tab label="Clusters"  />
                        <Tab label="Groups"  />
                        <Tab label="Products" />
                    </Tabs>
                    <IconButton onClick={() => setShowMenu(false)} sx={{marginRight: '5px', width:48}}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box borderBottom={'1px solid rgba(0, 0, 0, 0.12)'}>
                    {value === 0 &&
                        <Box p={'20px'}>
                            <StyledItemsContainer>
                                {
                                    'fwefwefwefwefweffwefwefwefwefewfwefwefwefwefwefwefwefwefwefwefwefwef'.split('').map((item, index) => {
                                        return <FakeNode key={index} borderColor={'#FF00FF'}/>;
                                    })
                                }
                            </StyledItemsContainer>
                        </Box>}
                    {value === 1 &&
                        <Box p={'20px'}>
                            <StyledItemsContainer>
                                {
                                    'fwefwefwefwefweffwefwefwefwefewfwefwefwefwefwefwefwefwefwefwefwefwef'.split('').map((item, index) => {
                                        return <FakeNode key={index} borderColor={'blue'}/>;
                                    })
                                }
                            </StyledItemsContainer>
                        </Box>}
                    {value === 2 &&
                        <Box p={'20px'}>
                            <StyledItemsContainer>
                                {
                                    'fwefwefwefwefweffwefwefwefwefewfwefwefwefwefwefwefwefwefwefwefwefwef'.split('').map((item, index) => {
                                        return <FakeNode key={index} borderColor={'black'}/>;
                                    })
                                }
                            </StyledItemsContainer>
                        </Box>}
                </Box>
                <StyledButton onClick={() => setShowMenu(prev => !prev)}>Не используемые элементы (10)</StyledButton>
            </StyledMenu>
        </>
    );
};

export default TopDrawer;
