import { ExternalAccountFormData, SetBankAccountPayload } from "../services/setBankAccount";

type ExternalBankAccountQuickAccessType = {
    usd: ExternalAccountFormData;
    eur: ExternalAccountFormData;
    gbp: ExternalAccountFormData;
    dkk: ExternalAccountFormData;
}

const externalBankAccounts: ExternalBankAccountQuickAccessType = {
    usd: {
        accountNumber: "000123456789",
        routingNumber: "084009519",
        accountHolderName: "freelancer demo",
        accountHolderType: "individual",
        accountCountry: "US",
        currency: "usd"
    },
    eur: {
        accountNumber: "FR1420041010050500013M02606",
        accountHolderName: "freelancer demo",
        accountHolderType: "individual",
        accountCountry: "FR",
        currency: "eur"
    },
    gbp: {
        accountNumber: "GB82WEST12345698765432",
        routingNumber: "108800",
        accountHolderName: "freelancer demo",
        accountHolderType: "individual",
        accountCountry: "GB",
        currency: "gbp"
    },
    dkk: {
        accountNumber: "DK5000400440116243",
        accountHolderName: "freelancer demo",
        accountHolderType: "individual",
        accountCountry: "DK",
        currency: "dkk"
    }
}


const generalBankAccounts: SetBankAccountPayload[] = [
    {
        ...externalBankAccounts.usd,
        firstName: "freelancer",
        lastName: "demo",
        email: "freelancer_demo@letsfreelancer.io",
        dob: {
            day: 10,
            month: 8,
            year: 1995
        },
        address: {
            country: "US",
            city: "New York",
            state: "New York",
            postal_code: "10010",
            line1: "99 W. 00th Street"
        },
        phoneNumber: "+15555555555"
    },
    {
        ...externalBankAccounts.eur,
        firstName: "freelancer",
        lastName: "demo",
        email: "freelancer_demo@letsfreelancer.io",
        dob: {
            day: 10,
            month: 8,
            year: 1995
        },
        address: {
            country: "FR",
            city: "Leon",
            state: "Molita",
            postal_code: "40550",
            line1: "street address 123"
        },
        phoneNumber: "+212666666666"
    },
    {
        ...externalBankAccounts.gbp,
        firstName: "freelancer",
        lastName: "demo",
        email: "freelancer_demo@letsfreelancer.io",
        dob: {
            day: 10,
            month: 8,
            year: 1995
        },
        address: {
            country: "GB",
            city: "London",
            postal_code: "SW1W 0NY",
            line1: "street address 123"
        },
        phoneNumber: "+212666666666"
    },
    {
        ...externalBankAccounts.dkk,
        firstName: "freelancer",
        lastName: "demo",
        email: "freelancer_demo@letsfreelancer.io",
        dob: {
            day: 10,
            month: 8,
            year: 1995
        },
        address: {
            country: "DK",
            city: "rosklide",
            postal_code: "1000",
            line1: "street address 123"
        },
        phoneNumber: "+4555000000"
    }
];

const bank_accounts_quick_access = {
    generalBankAccounts,
    externalBankAccounts
};

export default bank_accounts_quick_access;