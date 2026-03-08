import styled, { css } from 'styled-components';

const theme = {
  brand: '#44998a',
  brandLight: '#99c3bd',
  brandFaded: '#f0f6f5',
  headerBg: '#f8fafb',
  rowHover: '#f0f7f6',
  border: '#e2e8f0',
  textMain: '#2c3e50',
  textMuted: '#64748b',
  accent: '#44998a',
};

export const ListTableWrapper = styled.div<{ cols: number }>`
  display: grid;
  grid-template-columns: 
    max-content
    repeat(${props => props.cols - 2}, minmax(200px, auto))
    minmax(200px, 500px);
  max-height: calc(100vh - 175px);
  overflow: auto;
  border: 1px solid ${theme.border};
  border-radius: 8px;
  background-color: #fff;
  position: relative;

  &::-webkit-scrollbar { width: 6px; height: 6px; }
  &::-webkit-scrollbar-thumb { background: ${theme.brandLight}; border-radius: 10px; }
`;

export const ListTableRow = styled.div`
  display: contents;
  position: relative;
  &:hover .list-table-cell {
    background-color: ${theme.rowHover};
  }
  &:hover .list-table-cell:first-child {
    background-color: rgba(240, 247, 246, 0.7); 
  }
`;

export const ListTableHeaderRow = styled.div<{ sticky?: boolean }>`
  display: contents;
  .list-table-cell {
    background-color: ${theme.headerBg};
    color: ${theme.textMuted};
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    border-bottom: 2px solid ${theme.brandLight};
  }
  ${props => props.sticky && css`
    .list-table-cell {
      position: sticky;
      top: 0;
      z-index: 10;


    }
    && .list-table-cell:first-child {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 15;
      background-color: ${theme.headerBg};
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      @media (max-width: 768px) {
        position: static;
        z-index: auto;
      }
    }
  `}
`;

export const ListTableCell = styled.div.attrs({ className: 'list-table-cell' })<{ color?: string }>`
  min-height: 40px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${theme.border};
  background-color: #fff;
  font-size: 13px;
  color: ${theme.textMain};
  white-space: nowrap;
  //overflow: hidden;
  text-overflow: ellipsis;

  &:first-child {
    position: sticky;
    left: 0;
    z-index: 5;
    justify-content: start;
    overflow: hidden;
    text-overflow: ellipsis
    font-weight: 600;
    background-color: rgba(255, 255, 255, 0.8);
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    border-right: 2px solid ${theme.brandLight};
    color: ${theme.brand};
    @media (max-width: 768px) {
      position: static;
      z-index: auto;
      border-right: none;
    }
  }

  .table-link {
    color: ${theme.brand};
    font-weight: 500;
    &:hover { color: ${theme.brandLight}; }
  }

  .sort-btn.active {
    color: ${theme.brand};
  }
`;