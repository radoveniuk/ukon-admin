import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export type Option = {
  value: string | boolean | number;
  text: string;
  color?: string;
};

type Props = {
  options: Option[];
  onChange: (value: Option) => void;
  value: string | boolean | number | null;
  placeholder?: string;
  defaultOpen?: boolean;
};

const SelectContainer = styled.div<{ $isOpen: boolean }>`
  position: relative;
  flex: 1;
  min-width: 0;
  z-index: ${(props) => (props.$isOpen ? 100 : 1)};
`;

const SelectTrigger = styled.div<{ $bgColor?: string; $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  font-size: 12px;
  background-color: ${(props) => props.$bgColor || '#ffffff'};
  color: ${(props) => (props.$bgColor ? '#131313' : '#2c3e50')};
  border: 1px solid ${(props) => (props.$isOpen ? '#44998a' : '#e2e8f0')};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 28px;
  
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &::after {
    content: '';
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid ${(props) => (props.$bgColor ? '#ffffff' : '#64748b')};
    transform: ${(props) => (props.$isOpen ? 'rotate(180deg)' : 'none')};
    transition: transform 0.2s;
    margin-left: 4px;
    flex-shrink: 0;
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  margin: 0;
  padding: 4px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  list-style: none;
  z-index: 50;
  max-height: 200px;
  overflow-y: auto;
`;

const DropdownItem = styled.li<{ $isSelected: boolean }>`
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${(props) => (props.$isSelected ? '#f0f6f5' : 'transparent')};
  color: ${(props) => (props.$isSelected ? '#44998a' : '#2c3e50')};
  font-weight: ${(props) => (props.$isSelected ? '600' : '400')};

  &:hover {
    background-color: #f8fafb;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

export const Select = ({ options, value, onChange, placeholder = 'Vyberte...', defaultOpen = false }: Props) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((item) => String(item.value) === String(value));

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (option: Option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <SelectContainer ref={containerRef} $isOpen={isOpen}>
      <SelectTrigger
        $isOpen={isOpen}
        $bgColor={selectedOption?.color}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption.text : placeholder}
      </SelectTrigger>
      {isOpen && (
        <DropdownMenu>
          {options.map((item) => (
            <DropdownItem
              key={String(item.value)}
              $isSelected={String(item.value) === String(value)}
              onClick={() => handleSelect(item)}
            >
              {item.color && <div className="status-dot" style={{ backgroundColor: item.color }} />}
              {item.text}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </SelectContainer>
  );
};