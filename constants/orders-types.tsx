import { ReactNode } from 'react';
import { BiDownload, BiTrash } from 'react-icons/bi';
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import set from 'lodash.set';

import STATUSES from 'data/order-statuses.json';

import { formatIso } from 'helpers/datetime';

type Col = { key: string; title: string, render?: (row: any, updateOrder: (row: any) => void) => ReactNode, readonly?: boolean }

export type OrderType = {
  name: string;
  text: string;
  cols: Col[]
};

const renderStatus = (row) => <>{STATUSES.find(item => item.id === row.status)?.title || row.status}</>;

const renderDoc = (row: any, path: string, updateOrderFn: (row) => void) => {
  const deleteDoc = (docId: string) => {
    let docs = get(row, path) as string | string[];
    if (Array.isArray(docs)) {
      docs = docs.filter((doc) => doc !== docId);
    } else {
      docs = [];
    }
    const updatedRow = cloneDeep(row);
    set(updatedRow, path, docs);
    fetch(`/api/files?id=${docId}`, { method: 'DELETE' }).then(() => updateOrderFn(updatedRow));
  };
  const filesList: string[] = Array.isArray(get(row, path)) ? get(row, path) : (get(row, path) ? [get(row, path)] : []);
  return filesList.map((docId) => (
    <div key={docId} style={{ display: 'flex' }}>
      <a href={`/api/files?id=${docId}`} download>{docId}<BiDownload size={20} /></a>
      <div role="button" onClick={() => void deleteDoc(docId)}><BiTrash color="red" size={20} /></div>
    </div>
  ));
};

export const CREATE_INDIVIDUAL_COLS: Col[] = [
  {
    key: 'xml',
    title: 'XML',
    render(row) {
      return <a href={`/api/orders/xml?id=${row.id}`} download={`${row.id}.xml`}>Download <BiDownload size={20} /></a>;
    },
  },
  {
    key: 'user.fullname',
    title: 'Created by',
    readonly: true,
    render: (row) => row.user.fullname || row.user.email,
  },
  {
    key: 'date',
    title: 'Last changes date',
    readonly: true,
  },
  {
    key: 'payed',
    title: 'Payed',
    render: (row) => (row.payed || false).toString(),
  },
  {
    key: 'status',
    title: 'Status',
    render: renderStatus,
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
        {row.formData.otherActivities?.map((item, i) => (
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
        return <div><span>Ukon</span><br /><b>{row.formData.vAddressTariff.price}€ / year</b></div>;
      } else if (row.formData.ownAddressType === 'permit') {
        return 'Address of permit residence in Slovakia';
      } else if (isEmpty(row.formData.ownBusinessAddress)) {
        return '';
      }
      return <>Client&apos;s address: {row.formData.ownBusinessAddress.street}, {row.formData.ownBusinessAddress.houseNumber}, {row.formData.ownBusinessAddress.zip} {row.formData.ownBusinessAddress.city}</>;
    },
    readonly: true,
  },
  {
    key: 'formData.period.value',
    title: 'Ukon business address years',
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
    key: 'formData.address.street',
    title: 'Street (Addres)',
  },
  {
    key: 'formData.address.houseRegNumber',
    title: 'House reg. number (Addres)',
  },
  {
    key: 'formData.address.houseNumber',
    title: 'House number (Addres)',
  },
  {
    key: 'formData.address.city',
    title: 'City (Addres)',
  },
  {
    key: 'formData.address.zip',
    title: 'Zip (Addres)',
  },
  {
    key: 'formData.addressSk.street',
    title: 'Street (Slovakia)',
  },
  {
    key: 'formData.addressSk.houseRegNumber',
    title: 'House reg. number (Slovakia)',
  },
  {
    key: 'formData.addressSk.houseNumber',
    title: 'House number (Slovakia)',
  },
  {
    key: 'formData.addressSk.city',
    title: 'City (Slovakia)',
  },
  {
    key: 'formData.addressSk.zip',
    title: 'Zip (Slovakia)',
  },
  {
    key: 'formData.physicalNumber',
    title: 'Individual number',
  },
  {
    key: 'formData.birthdate',
    title: 'Birthdate',
  },
  {
    key: 'formData.insurance.Value',
    title: 'Insurance',
  },
  {
    key: 'formData.docNumber',
    title: 'Document number',
  },
  {
    key: 'formData.comment',
    title: 'Comment',
  },
  {
    key: 'formData.addressPermisionDoc',
    title: 'Address permissiion',
    render(row, updateOrder) {
      return renderDoc(row, this.key, updateOrder);
    },
  },
  {
    key: 'formData.proxyDoc',
    title: 'Power of attorney',
    render(row, updateOrder) {
      return <>{row.formData.proxyDoc && renderDoc(row, this.key, updateOrder)}</>;
    },
  },
  {
    key: 'formData.bankAccountReferralDoc',
    title: 'Bank referral document',
    render(row, updateOrder) {
      return <>{row.formData.bankAccountReferralDoc && renderDoc(row, this.key, updateOrder)}</>;
    },
  },
  {
    key: 'formData.identDoc',
    title: 'Identification',
    render(row, updateOrder) {
      return <>{row.formData.identDoc && renderDoc(row, this.key, updateOrder)}</>;
    },
  },
  {
    key: 'formData.nonConvictDoc',
    title: 'Non-conviction',
    render(row, updateOrder) {
      return <>{row.formData.nonConvictDoc && renderDoc(row, this.key, updateOrder)}</>;
    },
  },
];

export const UPDATE_INDIVIDUAL_COLS: Col[] = [
  {
    key: 'user.fullname',
    title: 'Created by',
    readonly: true,
    render: (row) => row.user.fullname || row.user.email,
  },
  {
    key: 'date',
    title: 'Date',
    readonly: true,
  },
  {
    key: 'payed',
    title: 'Payed',
    render: (row) => (row.payed || false).toString(),
  },
  {
    key: 'status',
    title: 'Status',
    render: renderStatus,
  },
  {
    key: 'formData.prev',
    title: 'Editing entrepreneur',
    render: (row) => <>{row.formData.prev.name} ({row.formData.prev.cin})</>,
    readonly: true,
  },
  {
    key: 'formData.fullname',
    title: 'New name',
    // render: (row) => <>{row.formData.prev.name} ({row.formData.prev.cin})</>,
  },
  {
    key: 'formData.companyName',
    title: 'Company name',
    render: (row) => <>{row.formData.fullname}{row.formData.companyName ? ` - ${row.formData.companyName}` : ''}</>,
  },
  {
    key: 'formData.addressResidence.street',
    title: 'New Street (Addres)',
  },
  {
    key: 'formData.addressResidence.houseRegNumber',
    title: 'New House reg. number (Addres)',
  },
  {
    key: 'formData.addressResidence.houseNumber',
    title: 'New House number (Addres)',
  },
  {
    key: 'formData.addressResidence.city',
    title: 'New City (Addres)',
  },
  {
    key: 'formData.addressResidence.zip',
    title: 'New Zip (Addres)',
  },
  {
    key: 'formData.newActivities',
    title: 'New activities',
    render: (row) => (
      <ul>
        {row.formData.newActivities?.map((item, i) => (
          <li key={item.Value}>{i+1}. {item.Value}</li>
        ))}
      </ul>
    ),
    readonly: true,
  },
  {
    key: 'Activities to stop',
    title: 'Activities to stop',
    render: (row) => (
      <ul>
        {row.formData.activities?.filter((item) => get(item, '_.status') === 'stopped')?.map((item, i) => (
          <li key={item.description}>{i+1}. {item.description}</li>
        ))}
      </ul>
    ),
    readonly: true,
  },
  {
    key: 'Activities to liquidate',
    title: 'Activities to liquidate',
    render: (row) => (
      <ul>
        {row.formData.activities?.filter((item) => get(item, '_.status') === 'closed')?.map((item, i) => (
          <li key={item.description}>{i+1}. {item.description} (from {formatIso(item._.effective_to)})</li>
        ))}
      </ul>
    ),
    readonly: true,
  },
  {
    key: 'formData.addressPermisionDoc',
    title: 'Address permissiion',
    render(row, updateOrder) {
      return renderDoc(row, this.key, updateOrder);
    },
  },
  {
    key: 'formData.proxyDoc',
    title: 'Power of attorney',
    render(row, updateOrder) {
      return <>{row.formData.proxyDoc && renderDoc(row, this.key, updateOrder)}</>;
    },
  },
  {
    key: 'formData.identDoc',
    title: 'Identification',
    render(row, updateOrder) {
      return <>{row.formData.identDoc && renderDoc(row, this.key, updateOrder)}</>;
    },
  },
  {
    key: 'formData.nonConvictDoc',
    title: 'Non-conviction',
    render(row, updateOrder) {
      return <>{row.formData.nonConvictDoc && renderDoc(row, this.key, updateOrder)}</>;
    },
  },
];

export const VIRTUAL_ADDRESS_COLS: Col[] = [
  {
    key: 'user.fullname',
    title: 'Created by',
    readonly: true,
    render: (row) => row.user.fullname || row.user.email,
  },
  {
    key: 'date',
    title: 'Date',
    readonly: true,
  },
  {
    key: 'payed',
    title: 'Payed',
    render: (row) => (row.payed || false).toString(),
  },
  {
    key: 'status',
    title: 'Status',
    render: renderStatus,
  },
  {
    key: 'formData.address.value',
    title: 'Virtual address',
    readonly: true,
  },
  {
    key: 'formData.period.value',
    title: 'Years',
    readonly: true,
  },
  {
    key: 'formData.orderFromDate',
    title: 'Order from',
    readonly: true,
  },
  {
    key: 'formData.tariff',
    title: 'Tariff',
    readonly: true,
    render: (row) => <>{row.formData.tariff.price}€ / year</>,
  },
  {
    key: 'formData.fullname',
    title: 'Fullname',
  },
  {
    key: 'formData.businessName',
    title: 'Name of the company',
  },
  {
    key: 'formData.businessId',
    title: 'ICO',
  },
  {
    key: 'formData.comment',
    title: 'Comment',
    readonly: true,
  },
];

export const ORDER_TYPES: OrderType[] = [
  { name: 'create-individual', text: 'Open individual entrepreneur', cols: CREATE_INDIVIDUAL_COLS },
  { name: 'update-individual', text: 'Update individual entrepreneur', cols: UPDATE_INDIVIDUAL_COLS },
  { name: 'v-address', text: 'Virtual address', cols: VIRTUAL_ADDRESS_COLS },
];