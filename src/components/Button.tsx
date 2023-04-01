import styled, { css } from 'styled-components';

const Button = styled.button<{ appearance?: 'primary' | 'secondary'; disabled?: boolean }>`
  border: 1px solid gray;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.8rem;

  ${({ appearance }) => (appearance === 'secondary' ? ButtonSecondary : ButtonPrimary)};
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

export default Button;
