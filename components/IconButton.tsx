import styled, { css } from 'styled-components';

const IconButton = styled.button<{ $variant?: 'save' | 'cancel' | 'action' }>`
  && {
    background-color: transparent;
    border: none;
    padding: 0px;
    margin: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #cbd5e1;
    transition: color 0.2s;
    font-size: 14px;
    flex-shrink: 0;
    border-radius: 0;
    gap: 0;

    &:hover {
      background-color: transparent;
      color: ${(props) => props.$variant === 'cancel' ? '#ef4444' : props.$variant === 'save' ? '#44998a' : '#64748b'};
    }

    &:focus {
      outline: none;
    }
  }
`;

export default IconButton;
