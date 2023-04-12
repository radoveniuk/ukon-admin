import { ReactNode } from 'react';

type Col = { key: string; title: string, render?: (row: any) => ReactNode, readonly?: boolean }

export type OrderType = {
  name: string;
  text: string;
  cols: Col[]
};

export const CREATE_INDIVIDUAL_COLS: Col[] = [
  {
    key: 'user.fullname',
    title: 'Created by',
    readonly: true,
  },
  {
    key: 'date',
    title: 'Last changes date',
    readonly: true,
  },
  {
    key: 'formData.mainActivity.Value',
    title: 'Main business activity',
    readonly: true,
  },
  {
    key: 'formData.activities',
    title: 'Other activities',
    render: (row) => (
      <ul>
        {row.formData.otherActivities.map((item, i) => (
          <li key={item.Value}>{i+1}. {item.Value}</li>
        ))}
      </ul>
    ),
    readonly: true,
  },
  {
    key: 'formData.businessAddress',
    title: 'Business Address',
    render(row) {
      if (row.formData.businessAddress === 'ukon') {
        return <div><span>Ukon, {row.formData.ourBusinessAddress.value},</span><br /><b>{row.formData.vAddressTariff.price}€ / year</b></div>;
      }
      return <>Client&apos;s address: {row.formData.ownBusinessAddress.street}, {row.formData.ownBusinessAddress.houseNumber}, {row.formData.ownBusinessAddress.zip} {row.formData.ownBusinessAddress.city}</>;
    },
    readonly: true,
  },
  {
    key: 'formData.isPrevIndividual.value',
    title: 'Had previosly?',
    render: (row) => <>{row.formData.isPrevIndividual.value ? 'Yes' : 'No'}</>,
    readonly: true,
  },
  {
    key: 'formData.citizenship.Value',
    title: 'Citizenship',
    readonly: true,
  },
  {
    key: 'formData.residence.Value',
    title: 'Residence country',
    readonly: true,
  },
  {
    key: 'formData.fullname',
    title: 'Entrepreneur name',
  },
  {
    key: 'formData.companyName',
    title: 'Company name',
    render: (row) => <>{row.formData.fullname}{row.formData.companyName ? ` - ${row.formData.companyName}` : ''}</>,
  },
  {
    key: 'status',
    title: 'Status',
  },
];

export const UPDATE_INDIVIDUAL_COLS: Col[] = [
  {
    key: 'user.fullname',
    title: 'Created by',
    readonly: true,
  },
  {
    key: 'date',
    title: 'Date',
    readonly: true,
  },
  {
    key: 'status',
    title: 'Status',
  },
];

export const VIRTUAL_ADDRESS_COLS: Col[] = [
  {
    key: 'user.fullname',
    title: 'Created by',
    readonly: true,
  },
  {
    key: 'date',
    title: 'Date',
    readonly: true,
  },
  {
    key: 'status',
    title: 'Status',
  },
];

export const ORDER_TYPES: OrderType[] = [
  { name: 'create-individual', text: 'Open individual entrepreneur', cols: CREATE_INDIVIDUAL_COLS },
  { name: 'update-individual', text: 'Update individual entrepreneur', cols: UPDATE_INDIVIDUAL_COLS },
  { name: 'v-address', text: 'Virtual address', cols: VIRTUAL_ADDRESS_COLS },
];