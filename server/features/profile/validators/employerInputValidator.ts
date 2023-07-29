import { IEmployerRole } from "../profile.model";

const isValidEmployeesInput = (employees: IEmployerRole["employees"] | undefined) => {
    const isValidEmployees = employees && employees >= 0 || employees === 0;
    return isValidEmployees;
}

const isValidCompanyInput = (company: IEmployerRole["companyName"] | undefined) => {
    const isValidCompany = company || company === "";
    return isValidCompany;
}

const isValidWebsiteInput = (website: IEmployerRole["website"] | undefined) => {
    const isValidWebsite = website || website === "";
    return isValidWebsite;
}

export {
    isValidCompanyInput,
    isValidEmployeesInput,
    isValidWebsiteInput
}