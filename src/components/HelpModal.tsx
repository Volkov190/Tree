import { FC, memo } from 'react';
import styled from 'styled-components';
import { CloseOutline } from '../assets/icons';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: FC<HelpModalProps> = ({ onClose }) => {
  return (
    <StyledModal onClick={onClose}>
      <StyledContent onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between">
          <h4 className="my-0">Справка:</h4>
          <StyledCloseOutline onClick={onClose} />
        </div>
        <ul className="mb-0 mt-2 pe-4">
          <li>Во всплывающем окне сверху можно увидеть кластеры/группы/товары без связей.</li>
          <li>При нажатии на элемент в сайдбаре справа можно увидеть и изменить информацию о сущности.</li>
          <li>В графе сплошные/пунктирные линии означают что связанный элемент значимый/не значимый соответственно.</li>
        </ul>
      </StyledContent>
    </StyledModal>
  );
};

const StyledCloseOutline = styled(CloseOutline)`
  cursor: pointer;

  &:hover {
    path {
      fill: black !important;
    }
  }
`;

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  background: #00000024;
  z-index: 1000;

  height: 100vh;
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledContent = styled.div`
  width: 600px;
  background: #fff;
  border-radius: 16px;
  padding: 16px 16px;
`;

export default memo(HelpModal);
