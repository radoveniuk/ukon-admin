import get from 'lodash.get';
import set from 'lodash.set';
import { DateTime } from 'luxon';
import xml2js from 'xml2js';

import { NON_SLOVAK_XML_TEMPLATE } from 'constants/xmlJsonTemplates';

const getTodayIso = () => DateTime.now().startOf('day').toISODate();

const getNonSlovakMap = () => ({
  'CorporateBody.StatutoryBody.PhysicalPerson.PersonName.Prefix.Affix.NonCodelistData': 'formData.parsedName.prefix',
  'CorporateBody.StatutoryBody.PhysicalPerson.PersonName.GivenName': 'formData.parsedName.name',
  'CorporateBody.StatutoryBody.PhysicalPerson.PersonName.FamilyName': 'formData.parsedName.surname',
  'CorporateBody.StatutoryBody.PhysicalPerson.PersonName.GivenFamilyName': 'formData.parsedName.surname',
  'CorporateBody.StatutoryBody.PhysicalPerson.PersonName.Postfix.Affix.NonCodelistData': 'formData.parsedName.postfix',
  'CorporateBody.StatutoryBody.PhysicalPerson.ID.IdentifierValue': 'formData.physicalNumber',
  'CorporateBody.StatutoryBody.PhysicalPerson.Citizenship.Codelist.CodelistItem.ItemCode': 'formData.citizenship.Code',
  'CorporateBody.StatutoryBody.PhysicalPerson.Citizenship.Codelist.CodelistItem.ItemName': 'formData.citizenship.Value',
  'CorporateBody.StatutoryBody.PhysicalPerson.ID2.IdentifierValue': 'formData.docNumber',
  'CorporateBody.StatutoryBody.PhysicalAddress.Country.Codelist.CodelistItem.ItemCode': 'formData.residence.Code',
  'CorporateBody.StatutoryBody.PhysicalAddress.Country.Codelist.CodelistItem.ItemName': 'formData.residence.Value',
  'CorporateBody.StatutoryBody.PhysicalAddress.Municipality.Codelist.CodelistItem.ItemName': 'formData.address.city',
  'CorporateBody.StatutoryBody.PhysicalAddress.StreetName': 'formData.address.street',
  'CorporateBody.StatutoryBody.PhysicalAddress.BuildingNumber': 'formData.address.houseNumber',
  'CorporateBody.StatutoryBody.PhysicalAddress.PropertyRegistrationNumber': 'formData.address.houseRegNumber',
  'CorporateBody.StatutoryBody.PhysicalAddress.DeliveryAddress.PostalCode': 'formData.address.zip',
  'CorporateBody.CorporateBodyFullName': 'formData.fullname',
  'CorporateBody.InHealthInsuranceText': 'formData.insurance.Value',
  'CorporateBody.PhysicalAddressDelivery.County.Codelist.CodelistItem.ItemCode': 'КОД РАЙОНА ИЗ АПИ',
  'CorporateBody.PhysicalAddressDelivery.County.Codelist.CodelistItem.ItemName': 'РАЙОН ИЗ АПИ',
  'CorporateBody.PhysicalAddressDelivery.Municipality.Codelist.CodelistItem.ItemCode': 'КОД ГОРОДА ИЗ АПИ',
  'CorporateBody.PhysicalAddressDelivery.Municipality.Codelist.CodelistItem.ItemName': 'formData.addressSk.city',
  'CorporateBody.PhysicalAddressDelivery.StreetName': 'formData.addressSk.street',
  'CorporateBody.PhysicalAddressDelivery.BuildingNumber': 'formData.addressSk.houseNumber',
  'CorporateBody.PhysicalAddressDelivery.PropertyRegistrationNumber': 'formData.addressSk.houseRegNumber',
  'CorporateBody.PhysicalAddressDelivery.DeliveryAddress.PostalCode': 'formData.addressSk.zip',
  'DataOfForeignPerson.PhysicalAddressResidentialSR.County.Codelist.CodelistItem.ItemCode': 'КОД РАЙОНА ИЗ АПИ',
  'DataOfForeignPerson.PhysicalAddressResidentialSR.County.Codelist.CodelistItem.ItemName': 'РАЙОН ИЗ АПИ',
  'DataOfForeignPerson.PhysicalAddressResidentialSR.Municipality.Codelist.CodelistItem.ItemCode': 'КОД ГОРОДА ИЗ АПИ',
  'DataOfForeignPerson.PhysicalAddressResidentialSR.Municipality.Codelist.CodelistItem.ItemName': 'formData.addressSk.city',
  'DataOfForeignPerson.PhysicalAddressResidentialSR.StreetName': 'formData.addressSk.street',
  'DataOfForeignPerson.PhysicalAddressResidentialSR.BuildingNumber': 'formData.addressSk.houseNumber',
  'DataOfForeignPerson.PhysicalAddressResidentialSR.PropertyRegistrationNumber': 'formData.addressSk.houseRegNumber',
  'DataOfForeignPerson.PhysicalAddressResidentialSR.DeliveryAddress.PostalCode': 'formData.addressSk.zip',
  'DataOfForeignPerson.StakeholderForeignPerson.PhysicalPerson.PersonName.GivenName': 'formData.parsedName.name',
  'DataOfForeignPerson.StakeholderForeignPerson.PhysicalPerson.PersonName.FamilyName': 'formData.parsedName.surname',
  'DataOfForeignPerson.StakeholderForeignPerson.PhysicalPerson.PersonName.GivenFamilyName': 'formData.parsedName.surname',
  'DataOfForeignPerson.StakeholderForeignPerson.PhysicalPerson.ID.IdentifierValue': 'formData.physicalNumber',
  'DataOfForeignPerson.StakeholderForeignPerson.PhysicalPerson.DateOfBirth': 'formData.birthdate',
  'DataOfForeignPerson.StakeholderForeignPerson.Citizenship.Codelist.CodelistItem.ItemCode': 'formData.citizenship.Code',
  'DataOfForeignPerson.StakeholderForeignPerson.Citizenship.Codelist.CodelistItem.ItemName': 'formData.citizenship.Value',
  'DataOfForeignPerson.StakeholderForeignPerson.ID2IdentifierValue': 'formData.docNumber',
  'DataOfForeignPerson.StakeholderForeignPerson.DatumFrom': getTodayIso(),
  'DataOfForeignPerson.StakeholderForeignPerson.PhysicalAddress.Country.Codelist.CodelistItem.ItemCode': 'formData.residence.Code',
  'DataOfForeignPerson.StakeholderForeignPerson.PhysicalAddress.Country.Codelist.CodelistItem.ItemName': 'formData.residence.Value',
  'DataOfForeignPerson.StakeholderForeignPerson.PhysicalAddress.Municipality.Codelist.CodelistItem.ItemName': 'formData.address.city',
  'DataOfForeignPerson.StakeholderForeignPerson.PhysicalAddress.StreetName': 'formData.address.street',
  'DataOfForeignPerson.StakeholderForeignPerson.PhysicalAddress.BuildingNumber': 'formData.address.houseNumber',
  'DataOfForeignPerson.StakeholderForeignPerson.PhysicalAddress.PropertyRegistrationNumber': 'formData.address.houseRegNumber',
  'DataOfForeignPerson.StakeholderForeignPerson.PhysicalAddress.DeliveryAddress.PostalCode': 'formData.address.zip',
  'OtherDataA3.Qualification': '',
  'OtherDataA3.RealEstate': 'formData.realEstate',
  'Others.Date': getTodayIso(),
});

export const getCreateIndividualForeignerXML = (order: any) => {
  const xmlJson = { ...NON_SLOVAK_XML_TEMPLATE };
  const jsonMap = getNonSlovakMap();
  Object.keys(jsonMap).forEach((xmlTag) => {
    set(xmlJson, xmlTag, get(order, jsonMap[xmlTag]) ?? jsonMap[xmlTag]);
  });
  set(xmlJson, 'CorporateBody.StatutoryBody.PhysicalPerson.DateOfBirth', DateTime.fromFormat(get(order, 'formData.birthdate'), 'dd.MM.yyyy').toISODate());
  [get(order, 'formData.mainActivity'), ...(get(order, 'formData.otherActivities') || [])].forEach((activityItem: any) => {
    if (activityItem?.Code  === '-') return;
    xmlJson.ActivitiesVo.push({
      EconomicActivityClassification: {
        Codelist: {
          CodelistCode: 'CL005205',
          CodelistItem: {
            ItemCode: activityItem.Code,
            ItemName: activityItem.Value,
          },
        },
      },
      EffectiveFrom: getTodayIso(),
      EffectiveTo: '',
    });
  });
  const builder = new xml2js.Builder();
  const xml = builder.buildObject({ ZROHLASENIE_FO: { ...xmlJson } });

  return xml;
};