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

const renderStatus = (row) => {
  const status = STATUSES.find(item => item.id === row.status);
  if (status) {
    return (
      <span style={{ background: status.color, paddingTop: 7, paddingBottom: 7, fontWeight: 600 }}>
        {status.title}
      </span>
    );
  } else {
    return row.status;
  }
};

const renderDoc = (row: any, path: string, updateOrderFn: (row: any) => void, linkText: string) => {
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
      <a href={`/api/files?id=${docId}`} download>{linkText}<BiDownload size={20} /></a>
      <div role="button" onClick={() => void deleteDoc(docId)}><BiTrash color="red" size={20} /></div>
    </div>
  ));
};

export const CREATE_INDIVIDUAL_COLS: Col[] = [
  {
    key: 'number',
    title: 'Objednávka #',
    readonly: true,
  },
  {
    key: 'date',
    title: 'Dátum',
    readonly: true,
  },
  {
    key: 'user.fullname',
    title: 'Klient',
    readonly: true,
    render: (row) => row.user.fullname || row.user.email,
  },
  {
    key: 'status',
    title: 'Stáv',
    render: renderStatus,
  },
  {
    key: 'formData.bankAccount',
    title: 'Tatra',
    render: (row) => {
      const value = (row.formData.bankAccount || false).toString();
      const backgroundColor = value === 'true' ? '#dcf2e2' : value === 'false' ? '#fae3e1' : 'transparent';
      return <div style={{ backgroundColor }}>{value}</div>;
    },
    readonly: true,
  },
  {
    key: 'resendPermissionType',
    title: 'Doručenie dok.',
    render: (row) => {
      const name = row.formData.resendPermissionType.name;
      const backgroundColor = name === 'post' ? '#fae3e1' : '#dcf2e2';
      return <div style={{ backgroundColor }}>{name}</div>;
    },
  },
  {
    key: 'businessAddress',
    title: 'Miesto podnikatnia',
    render: (row) => {
      const businessAddress = row.formData.businessAddress || 'false';
      let backgroundColor = 'transparent';
      if (businessAddress === 'false' || businessAddress === 'permit') {
        backgroundColor = '#dcf2e2';
      } else if (businessAddress === 'own' || businessAddress === 'ukon') {
        backgroundColor = '#fae3e1';
      }
      const period = row.formData.period?.value || '';
      const tariff = row.formData.vAddressTariff?.label || '';
      const displayText = businessAddress === 'ukon' ? `${businessAddress} – ${period} r.; ${tariff}` : businessAddress;
      return <div style={{ backgroundColor }}>{displayText}</div>;
    },
    readonly: true,
  },
  {
    key: 'qualifiedActivities',
    title: 'Remeselné živnosti',
    render: (row) => {
      const isQualified = Array.isArray(row.formData.qualifiedActivities) && row.formData.qualifiedActivities.length > 0;
      const backgroundColor = isQualified ? '#fae3e1' : '#dcf2e2';
      return <div style={{ backgroundColor }}>{isQualified ? 'true' : 'false'}</div>;
    },
    readonly: true,
  },
  {
    key: 'residence',
    title: 'isSlovak',
    render: (row) => {
      const sk = row.formData.residence.sk === 'Slovensko' ? 'true' : 'false';
      const backgroundColor = sk ? '#dcf2e2' : '#fae3e1';
      return <div style={{ backgroundColor }}>{sk ? 'true' : 'false'}</div>;
    },
    readonly: true,
  },
  {
    key: 'payed',
    title: 'Úhrada',
    render: (row) => {
      const value = (row.payed || false).toString();
      const backgroundColor = value === 'true' ? '#dcf2e2' : value === 'false' ? '#fae3e1' : 'transparent';
      return <div style={{ backgroundColor }}>{value}</div>;
    },
  },
  {
    key: 'docs',
    title: 'Prílohy',
    render(row, updateOrder) {
      return (
        <>
          {row.formData.proxyDoc && renderDoc(row, 'formData.proxyDoc', updateOrder, 'Plnomocenstvo')}
          {row.formData.bankAccountReferralDoc && renderDoc(row, 'formData.bankAccountReferralDoc', updateOrder, 'Tatra')}
          {row.formData.identDoc && renderDoc(row, 'formData.identDoc', updateOrder, 'Doklad totožnosti')}
          {row.formData.nonConvictDoc && renderDoc(row, 'formData.nonConvictDoc', updateOrder, 'Výpis z RT')}
          {row.formData.addressPermisionDoc && renderDoc(row, 'formData.addressPermisionDoc', updateOrder, 'Súhlas (adresa)')}
        </>
      );
    },
  },
];

export const UPDATE_INDIVIDUAL_COLS: Col[] = [
  {
    key: 'number',
    title: 'Objednávka #',
    readonly: true,
  },
  {
    key: 'date',
    title: 'Dátum',
    readonly: true,
  },
  {
    key: 'user.fullname',
    title: 'Klient',
    readonly: true,
    render: (row) => row.user.fullname || row.user.email,
  },
  {
    key: 'status',
    title: 'Stáv',
    render: renderStatus,
  },
  {
    key: 'formData.bankAccount',
    title: 'Tatra',
    render: (row) => {
      const value = (row.formData.bankAccount || false).toString();
      const backgroundColor = value === 'true' ? '#dcf2e2' : value === 'false' ? '#fae3e1' : 'transparent';
      return <div style={{ backgroundColor }}>{value}</div>;
    },
    readonly: true,
  },
  {
    key: 'resendPermissionType',
    title: 'Doručenie dok.',
    render: (row) => {
      const name = row.formData.resendPermissionType?.name || 'email';
      const backgroundColor = '#dcf2e2';
      return <div style={{ backgroundColor }}>{name}</div>;
    },
    readonly: true,
  },
  {
    key: 'businessAddress',
    title: 'Miesto podnikatnia',
    render: (row) => {
      const businessAddress = row.formData.businessAddress || 'false';
      let backgroundColor = 'transparent';
      if (businessAddress === 'false' || businessAddress === 'permit') {
        backgroundColor = '#dcf2e2';
      } else if (businessAddress === 'own' || businessAddress === 'ukon') {
        backgroundColor = '#fae3e1';
      }
      const period = row.formData.period?.value || '';
      const tariff = row.formData.vAddressTariff?.label || '';
      const displayText = businessAddress === 'ukon' ? `${businessAddress} – ${period} r.; ${tariff}` : businessAddress;
      return <div style={{ backgroundColor }}>{displayText}</div>;
    },
    readonly: true,
  },
  {
    key: 'qualifiedActivities',
    title: 'Remeselné živnosti',
    render: (row) => {
      const isQualified = Array.isArray(row.formData.qualifiedActivities) && row.formData.qualifiedActivities.length > 0;
      const backgroundColor = isQualified ? '#fae3e1' : '#dcf2e2';
      return <div style={{ backgroundColor }}>{isQualified ? 'true' : 'false'}</div>;
    },
    readonly: true,
  },
  {
    key: 'residence',
    title: 'isSlovak',
    render: (row) => {
      const isSlovak = row.formData.prev.isSlovak === true;
      const backgroundColor = isSlovak ? '#dcf2e2' : '#fae3e1';
      return <div style={{ backgroundColor }}>{isSlovak ? 'true' : 'false'}</div>;
    },
    readonly: true,
  },
  {
    key: 'payed',
    title: 'Úhrada',
    render: (row) => {
      const value = (row.payed || false).toString();
      const backgroundColor = value === 'true' ? '#dcf2e2' : value === 'false' ? '#fae3e1' : 'transparent';
      return <div style={{ backgroundColor }}>{value}</div>;
    },
  },
  {
    key: 'docs',
    title: 'Prílohy',
    render(row, updateOrder) {
      return (
        <>
          {row.formData.proxyDoc && renderDoc(row, 'formData.proxyDoc', updateOrder, 'Plnomocenstvo')}
          {row.formData.bankAccountReferralDoc && renderDoc(row, 'formData.bankAccountReferralDoc', updateOrder, 'Tatra')}
          {row.formData.identDoc && renderDoc(row, 'formData.identDoc', updateOrder, 'Doklad totožnosti')}
          {row.formData.nonConvictDoc && renderDoc(row, 'formData.nonConvictDoc', updateOrder, 'Výpis z RT')}
          {row.formData.addressPermisionDoc && renderDoc(row, 'formData.addressPermisionDoc', updateOrder, 'Súhlas (adresa)')}
        </>
      );
    },
  },
];

export const CREATE_SIMPLE_COMPANY_COLS: Col[] = [
  {
    key: 'number',
    title: 'Objednávka #',
    readonly: true,
  },
  {
    key: 'date',
    title: 'Dátum',
    readonly: true,
  },
  {
    key: 'user.fullname',
    title: 'Klient',
    readonly: true,
    render: (row) => row.user.fullname || row.user.email,
  },
  {
    key: 'status',
    title: 'Stáv',
    render: renderStatus,
  },
  {
    key: 'formData.bankAccount',
    title: 'Tatra',
    render: (row) => {
      const value = (row.formData.bankAccount || false).toString();
      const backgroundColor = value === 'true' ? '#dcf2e2' : value === 'false' ? '#fae3e1' : 'transparent';
      return <div style={{ backgroundColor }}>{value}</div>;
    },
    readonly: true,
  },
  {
    key: 'resendPermissionType',
    title: 'Doručenie dok.',
    render: (row) => {
      const name = row.formData.addedService0 === true ? 'true' : 'false';
      const backgroundColor = name === 'true' ? '#fae3e1' : '#dcf2e2';
      return <div style={{ backgroundColor }}>{name}</div>;
    },
  },
  {
    key: 'businessAddress',
    title: 'Miesto podnikatnia',
    render: (row) => {
      const businessAddress = row.formData.businessAddress || 'false';
      let backgroundColor = 'transparent';
      if (businessAddress === 'false' || businessAddress === 'permit') {
        backgroundColor = '#dcf2e2';
      } else if (businessAddress === 'own' || businessAddress === 'ukon') {
        backgroundColor = '#fae3e1';
      }
      const period = row.formData.period?.value || '';
      const tariff = row.formData.vAddressTariff?.label || '';
      const displayText = businessAddress === 'ukon' ? `${businessAddress} – ${period} r.; ${tariff}` : businessAddress;
      return <div style={{ backgroundColor }}>{displayText}</div>;
    },
    readonly: true,
  },
  {
    key: 'qualifiedActivities',
    title: 'Remeselné živnosti',
    render: (row) => {
      const isQualified = Array.isArray(row.formData.qualifiedActivities) && row.formData.qualifiedActivities.length > 0;
      const backgroundColor = isQualified ? '#fae3e1' : '#dcf2e2';
      return <div style={{ backgroundColor }}>{isQualified ? 'true' : 'false'}</div>;
    },
    readonly: true,
  },
  {
    key: 'residence',
    title: 'isSlovak',
    render: (row) => {
      const sk = row.formData.residence.sk === 'Slovensko' ? 'true' : 'false';
      const backgroundColor = sk ? '#dcf2e2' : '#fae3e1';
      return <div style={{ backgroundColor }}>{sk ? 'true' : 'false'}</div>;
    },
    readonly: true,
  },
  {
    key: 'payed',
    title: 'Úhrada',
    render: (row) => {
      const value = (row.payed || false).toString();
      const backgroundColor = value === 'true' ? '#dcf2e2' : value === 'false' ? '#fae3e1' : 'transparent';
      return <div style={{ backgroundColor }}>{value}</div>;
    },
  },
  {
    key: 'docs',
    title: 'Prílohy',
    render(row, updateOrder) {
      return (
        <>
          {row.formData.proxyDoc && renderDoc(row, 'formData.proxyDoc', updateOrder, 'Plnomocenstvo')}
          {row.formData.bankAccountReferralDoc && renderDoc(row, 'formData.bankAccountReferralDoc', updateOrder, 'Tatra')}
          {row.formData.identDoc && renderDoc(row, 'formData.identDoc', updateOrder, 'Doklad totožnosti')}
          {row.formData.nonConvictDoc && renderDoc(row, 'formData.nonConvictDoc', updateOrder, 'Výpis z RT')}
          {row.formData.addressPermisionDoc && renderDoc(row, 'formData.addressPermisionDoc', updateOrder, 'Súhlas (adresa)')}
        </>
      );
    },
  },
];

export const ORDER_TYPES: OrderType[] = [
  { name: 'create-individual', text: 'Založenie živnosti', cols: CREATE_INDIVIDUAL_COLS },
  { name: 'update-individual', text: 'Zmeny v živnosti', cols: UPDATE_INDIVIDUAL_COLS },
  { name: 'create-simple-company', text: 'Založenie jednoosobovej s.r.o.', cols: CREATE_SIMPLE_COMPANY_COLS },
  { name: 'create-company', text: 'Založenie s.r.o.', cols: CREATE_SIMPLE_COMPANY_COLS },
];