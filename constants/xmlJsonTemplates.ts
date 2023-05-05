export const NON_SLOVAK_XML_TEMPLATE = {
  PersonDataApplicant: {
    PhysicalPerson: {
      PersonName: {
        GivenName: 'Dmytro',
        FamilyName: 'Fedorenko',
      },
    },
    CorporateBody: {
      CorporateBodyFullName: 'Úkon.sk s.r.o.',
      ID: {
        IdentifierValue: 54614392,
        IdentifierType: {
          Codelist: {
            CodelistCode: 'CL004001',
            CodelistItem: {
              ItemCode: 7,
              ItemName: 'IČO (Identifikačné číslo organizácie)',
            },
          },
        },
      },
    },
    TelephoneAddress: {
      Number: {
        FormattedNumber: 421950759277,
      },
    },
    ElectronicAddress: {
      EmailAddress: 'info@ukon.sk',
    },
    PhysicalAddress: {
      Country: {
        NonCodelistData: 'Slovenská republika',
      },
      County: {
        NonCodelistData: 'Bratislava',
      },
      Municipality: {
        NonCodelistData: 'Bratislava - mestská časť Ružinov',
      },
      StreetName: 'Drieňová',
      BuildingNumber: '1J',
      PropertyRegistrationNumber: 16940,
      DeliveryAddress: {
        PostalCode: 82101,
      },
    },
  },
  CorporateBody: {
    StatutoryBody: {
      PhysicalPerson: {
        PersonName: {
          Prefix: {
            Affix: {
              NonCodelistData: 'Х1Х Титул перед именем',
            },
          },
          GivenName: 'Х1Х Имя клиента',
          FamilyName: 'Х1Х Фамилия клиента',
          GivenFamilyName: 'Х1Х Фамилия при рождении',
          Postfix: {
            Affix: {
              NonCodelistData: 'Х1Х Титул после имени',
            },
          },
        },
        ID: {
          IdentifierValue: 'Х1Х Идентификационный номер (rodné číslo)',
          IdentifierType: {
            Codelist: {
              CodelistCode: 'CL004001',
              CodelistItem: {
                ItemCode: 9,
                ItemName: 'Rodné číslo',
              },
            },
          },
        },
        DateOfBirth: 'Х1Х Дата рождения',
        Citizenship: {
          Codelist: {
            CodelistCode: 'CL000086',
            CodelistItem: {
              ItemCode: 804,
              ItemName: 'Х1Х Гражданство',
            },
          },
        },
        ResidentialDateTo: 'foreignerХ1Х ***** ВНЖ/ПМЖ в Словакии до',
        ID2: {
          IdentifierValue: 'foreignerХ1Х  ***** Номер загранпаспорта',
          IdentifierType: {
            Codelist: {
              CodelistCode: 'CL0000**',
              CodelistItem: {
                ItemCode: 2,
                ItemName: 'foreignerХ1Х  ***** Číslo pasu (если нет Идентификационный номер (rodné číslo))',
              },
            },
          },
        },
      },
      PhysicalAddress: {
        Country: {
          Codelist: {
            CodelistCode: 'CL000086',
            CodelistItem: {
              ItemCode: 804,
              ItemName: 'Х2Х Страна постоянного места жительства',
            },
          },
        },
        County: {
          Codelist: {
            CodelistCode: 'CL000024',
            CodelistItem: {
              ItemCode: 'SKZZZ',
              ItemName: 'Zahraničie',
            },
          },
        },
        Municipality: {
          Codelist: {
            CodelistCode: 'CL000025',
            CodelistItem: {
              ItemCode: 'SKZZZZZZZZZZ',
              ItemName: 'Х2Х Город постоянного места жительства',
            },
          },
        },
        StreetName: 'Х2Х Улица постоянного места жительства',
        BuildingNumber: 'Х2Х Номер дома после "/"',
        PropertyRegistrationNumber: 'Х2Х Номер дома перед "/"',
        DeliveryAddress: {
          PostalCode: 'Х2Х Индекс',
        },
      },
    },
    CorporateBodyFullName: 'X8X Это название компании, которое по-умолчанию автоматом генерируется из имени, фамилии и титулов.',
    ID: {
      IdentifierValue: '',
      IdentifierType: {
        Codelist: {
          CodelistCode: '',
          CodelistItem: {
            ItemCode: '',
            ItemName: '',
          },
        },
      },
    },
    InHealthInsurance: '',
    InHealthInsuranceText: 'X7X Медицинская страховка',
    PhysicalAddress: {
      Country: {
        Codelist: {
          CodelistCode: 'CL000086',
          CodelistItem: {
            ItemCode: '',
            ItemName: '',
          },
        },
      },
    },
    PhysicalAddressDelivery: {
      County: {
        Codelist: {
          CodelistCode: 'CL000024',
          CodelistItem: {
            ItemCode: 'SK0102',
            ItemName: 'foreignerХ2Х Раён (желательно подгружать через API) - Okres Bratislava II',
          },
        },
      },
      Municipality: {
        Codelist: {
          CodelistCode: 'CL000025',
          CodelistItem: {
            ItemCode: 'SK0102529320',
            ItemName: 'foreignerХ2Х Город (желательно подгружать через API) - Bratislava - mestská časť Ružinov',
          },
        },
      },
      StreetName: 'foreignerХ2Х Улица - Drieňová',
      BuildingNumber: 'foreignerХ2Х Номер дома после "/" - 1J',
      PropertyRegistrationNumber: 'foreignerХ2Х Номер дома перед "/" - 16940',
      DeliveryAddress: {
        PostalCode: 'foreignerХ2Х Индекс - 82101',
      },
    },
  },
  StakeholderMandataryLP: {
    CorporateBody: {
      CorporateBodyFullName: 'Úkon.sk s.r.o.',
      ID: {
        IdentifierValue: '54614392',
        IdentifierType: {
          Codelist: {
            CodelistCode: 'CL004001',
            CodelistItem: {
              ItemCode: 7,
              ItemName: 'IČO (Identifikačné číslo organizácie)',
            },
          },
        },
      },
    },
    PhysicalAddress: {
      County: {
        Codelist: {
          CodelistCode: 'CL000024',
          CodelistItem: {
            ItemCode: 'SK0102',
            ItemName: 'Okres Bratislava II',
          },
        },
      },
      Municipality: {
        Codelist: {
          CodelistCode: 'CL000025',
          CodelistItem: {
            ItemCode: 'SK0102529320',
            ItemName: 'Bratislava - mestská časť Ružinov',
          },
        },
      },
      StreetName: 'Drieňová',
      BuildingNumber: '1J',
      PropertyRegistrationNumber: '16940',
      DeliveryAddress: {
        PostalCode: '82101',
      },
    },
  },
  DataOfForeignPerson: {
    BusinessFP: 1,
    OrgUnitFP: 0,
    OtherRegisterName: '',
    OtherRegisterNumber: '',
    PhysicalAddressResidentialSR: {
      County: {
        Codelist: {
          CodelistCode: 'CL000024',
          CodelistItem: {
            ItemCode: 'SK0101',
            ItemName: 'foreignerХ3Х ***** Раён места жительства в Словакии (желательно подгружать через API)',
          },
        },
      },
      Municipality: {
        Codelist: {
          CodelistCode: 'CL000025',
          CodelistItem: {
            ItemCode: 'SK0101528595',
            ItemName: 'foreignerХ3Х ***** Город места жительства в Словакии (желательно подгружать через API)',
          },
        },
      },
      StreetName: 'foreignerХ3Х ***** Улица места жительства в Словакии',
      BuildingNumber: 'foreignerХ3Х ***** Номер дома после "/"',
      PropertyRegistrationNumber: 'foreignerХ3Х ***** Номер дома перед "/"',
      DeliveryAddress: {
        PostalCode: 'foreignerХ3Х ***** Почтовый индекс (желательно подгружать через API)',
      },
    },
    PhysicalAddressForeignPerson: {
      County: {
        Codelist: {
          CodelistCode: 'CL000024',
          CodelistItem: {
            ItemCode: 'SK0101',
            ItemName: 'foreignerХ4Х Раён предпринимателького адреса (желательно подгружать через API)Раён предпринимателького адреса (желательно подгружать через API)',
          },
        },
      },
      Municipality: {
        Codelist: {
          CodelistCode: 'CL000025',
          CodelistItem: {
            ItemCode: 'SK0101528595',
            ItemName: 'foreignerХ4Х Город предпринимателького адреса (желательно подгружать через API)',
          },
        },
      },
      StreetName: 'foreignerХ4Х Улица предпринимательского адреса',
      BuildingNumber: 'foreignerХ4Х Номер дома после "/"',
      PropertyRegistrationNumber: 'foreignerХ4Х Номер дома перед "/"',
      DeliveryAddress: {
        PostalCode: 'foreignerХ4Х Почтовый индекс (желательно подгружать через API)',
      },
      TelephoneAddress: {
        Number: {
          FormattedNumber: 'X6X Номер телефона',
        },
      },
      ElectronicAddress: {
        EmailAddress: 'X6X Эл. почта',
      },
    },
    StakeholderForeignPerson: {
      PhysicalPerson: {
        PersonName: {
          GivenName: 'Х1Х Имя клиента',
          FamilyName: 'Х1Х Фамилия клиента',
          GivenFamilyName: 'Х1Х Фамилия при рождении',
        },
        ID: {
          IdentifierValue: 'Х1Х ***** Идентификационный номер (rodné číslo)',
          IdentifierType: {
            Codelist: {
              CodelistCode: 'CL004001',
              CodelistItem: {
                ItemCode: 9,
                ItemName: 'Rodné číslo',
              },
            },
          },
        },
        DateOfBirth: 'Х1Х Дата рождения',
        Citizenship: {
          Codelist: {
            CodelistCode: 'CL000086',
            CodelistItem: {
              ItemCode: 804,
              ItemName: 'Х1Х Гражданство',
            },
          },
        },
        ID2: {
          IdentifierValue: 'foreignerХ1Х  ***** Номер загранпаспорта (если нет Идентификационный номер (rodné číslo))',
          IdentifierType: {
            Codelist: {
              CodelistCode: 'CL0000**',
              CodelistItem: {
                ItemCode: 2,
                ItemName: 'Číslo pasu',
              },
            },
          },
        },
      },
      DatumFrom: 'X9X - Дата подачи заявки',
      DatumTo: '',
      PhysicalAddress: {
        Country: {
          Codelist: {
            CodelistCode: 'CL000086',
            CodelistItem: {
              ItemCode: 804,
              ItemName: 'Х2Х Страна постоянного места жительства',
            },
          },
        },
        County: {
          Codelist: {
            CodelistCode: 'CL000024',
            CodelistItem: {
              ItemCode: 'SKZZZ',
              ItemName: 'Zahraničie',
            },
          },
        },
        Municipality: {
          Codelist: {
            CodelistCode: 'CL000025',
            CodelistItem: {
              ItemCode: 'SKZZZZZZZZZZ',
              ItemName: 'Х2Х Город постоянного места жительства',
            },
          },
        },
        StreetName: 'Х2Х Улица постоянного места жительства',
        BuildingNumber: 'Х2Х Номер дома после "/"',
        PropertyRegistrationNumber: 'Х2Х Номер дома перед "/"',
        DeliveryAddress: {
          PostalCode: 'Х2Х Индекс',
        },
      },
    },
  },
  OtherDataA3: {
    Qualification: '',
    RealEstate: 'Х4Х какими доками клиент подтверждает свое право управлять недвижимостью (это поле нужно заполнять только, если клиент не является владельцем недвижимости, находящейся по указанному адресу прописки/предпринимательства)',
    JKMOR: 0,
    LegalFormCodeJKM: 422,
  },
  ActivitiesVo: [],
  HealtInsurance: {
    ApplicationToHealtInsurance: '',
    ApplicationToHealtInsuranceText: '',
    ApplicationDate: '',
    ApplicationTime: '',
    CardID: '',
    WithOutResidentialAddressSR: '',
    WithResidentialAddressSR: '',
  },
  SubmittedDocuments: {
    AuthorisedLetter: 0,
    CertifiedCopy: 0,
    ConsentAuthorised: 0,
    ExtractCR: 1,
    RealEstate: 1,
  },
  Declaration: 0,
  Others: {
    Date: 'X9X - Дата подачи заявки',
    CheckDeliveryAdr: 1,
    CheckMandataryLP: 1,
    CheckMandataryNP: 0,
    CheckRegistrationDU: 1,
    CheckRegistrationZP: 1,
  },
};