import React, { HTMLAttributes, ReactNode } from 'react';

// import { useTranslation } from 'react-i18next';
import { ListTableCell, ListTableHeaderRow, ListTableWrapper } from './styles';

type Props = {
  columns: string[]
  children?: ReactNode;
  columnComponent?: (col: string, index: number) => ReactNode;
  stickyHeader?: boolean;
  renderIf?: boolean;
} & HTMLAttributes<HTMLDivElement>

const ListTable = ({ columns, children, columnComponent, stickyHeader, renderIf = true, ...rest }: Props) => {
  // const { t } = useTranslation();
  if (!renderIf) return null;
  return (
    <ListTableWrapper cols={columns.length} {...rest}>
      <ListTableHeaderRow sticky={stickyHeader}>
        {columns.map((column, index) => (
          <ListTableCell
            key={column + index}
          >
            {columnComponent?.(column, index) || column}
          </ListTableCell>
        ))}
      </ListTableHeaderRow>
      {children}
    </ListTableWrapper>
  );
};

export default ListTable;
