import { FC } from 'react';
import styled, { css } from 'styled-components';
import Tooltip from 'rc-tooltip';

interface ButtonProps {
  appearance?: 'primary' | 'secondary';
  disabled?: boolean;
  isIconButton?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  tooltipText?: string;
  color?: string;
}

const Button: FC<ButtonProps> = ({ tooltipText, children, ...props }) => {
  if (tooltipText)
    return (
      <Tooltip showArrow={false} placement="right" trigger={['hover']} overlay={() => <span>{tooltipText}</span>}>
        <StyledButton {...props}>{children}</StyledButton>
      </Tooltip>
    );

  return <StyledButton {...props}>{children}</StyledButton>;
};

const StyledButton = styled.button<{
  appearance?: 'primary' | 'secondary';
  disabled?: boolean;
  isIconButton?: boolean;
}>`
  border: 1px solid gray;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.8rem;

  ${({ disabled }) => disabled && 'cursor: default;'}

  ${({ appearance, isIconButton }) => {
    if (isIconButton) return ButtonIcon;

    return appearance === 'secondary' ? ButtonSecondary : ButtonPrimary;
  }};
`;

const ButtonPrimary = css<{ disabled?: boolean }>`
  color: white;
  background: ${({ disabled }) => (disabled ? 'gray' : '#0062ff')};

  &:hover {
    background: ${({ disabled }) => (disabled ? 'gray' : '#0055dd')};
  }
`;

const ButtonSecondary = css<{ disabled?: boolean }>`
  background: ${({ disabled }) => (disabled ? 'gray' : '#ffffff')};

  &:hover {
    background: ${({ disabled }) => (disabled ? 'gray' : '#dddddd')};
  }
`;

const ButtonIcon = css<{ disabled?: boolean; color?: string }>`
  background: ${({ disabled }) => (disabled ? '#eeeeee' : '#ffffff')};

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#eeeeee' : '#e9e9e9')};
  }

  border: none;
  padding: 2px;
`;

export default Button;
