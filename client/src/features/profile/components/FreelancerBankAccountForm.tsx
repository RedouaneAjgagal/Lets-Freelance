import { useState } from "react";
import Input from "../../../components/Input"
import { PrimaryButton } from "../../../layouts/brand";
import bankAccountValidator from "../validators/bankAccountValidator";
import { UseMutationResult } from "@tanstack/react-query";
import { AddExternalBankAccountPayload, AddExternalBankAccountResponse, ExternalAccountFormData, SetBankAccountPayload, SetBankAccountResponse } from "../../auth";
import { AxiosError } from "axios";

type FreelancerBankAccountFormProps = {
    externalAccountOnly: false;
    submit: UseMutationResult<SetBankAccountResponse, AxiosError<{
        msg: string;
    }, any>, SetBankAccountPayload, unknown>;
}

type FreelancerExternalBankAccountProps = {
    externalAccountOnly: true;
    submit: UseMutationResult<AddExternalBankAccountResponse, AxiosError<{
        msg: string;
    }, any>, AddExternalBankAccountPayload, unknown>
    onClose: () => void;
}

const FreelancerBankAccountForm = (props: React.PropsWithoutRef<FreelancerBankAccountFormProps | FreelancerExternalBankAccountProps>) => {
    const initialInputErrorState = {
        holderType: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dob: "",
        country: "",
        city: "",
        state: "",
        postalCode: "",
        line1: "",
        line2: "",
        accountNumber: "",
        routingNumber: "",
        fullName: "",
        bankCountry: "",
        currency: "",
    };

    const [inputsErros, setInputErros] = useState(initialInputErrorState);

    const [date] = new Date().toISOString().split("T");

    const setBankAccoountHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (props.submit.isLoading) return;

        const formData = new FormData(e.currentTarget);

        const data = {
            firstName: formData.get("generalInfo_firstName")?.toString(),
            lastName: formData.get("generalInfo_lastName")?.toString(),
            email: formData.get("generalInfo_email")?.toString(),
            phoneNumber: formData.get("generalInfo_phoneNumber")?.toString(),
            dob: formData.get("generalInfo_dob")?.toString(),
            country: formData.get("generalInfo_country")?.toString(),
            city: formData.get("generalInfo_city")?.toString(),
            state: formData.get("generalInfo_state")?.toString(),
            postalCode: formData.get("generalInfo_postalCode")?.toString(),
            line1: formData.get("generalInfo_line1")?.toString(),
            line2: formData.get("generalInfo_line2")?.toString(),
            holdetType: formData.get("bankInfo_holderType")?.toString(),
            accountNumber: formData.get("bankInfo_accountNumber")?.toString(),
            routingNumber: formData.get("bankInfo_routingNumber")?.toString(),
            fullName: formData.get("bankInfo_fullName")?.toString(),
            bankCountry: formData.get("bankInfo_country")?.toString(),
            currency: formData.get("bankInfo_currency")?.toString(),
        }

        const invalidInputs = bankAccountValidator({
            externalAccountOnly: props.externalAccountOnly,
            formData: data
        });

        setInputErros(invalidInputs);

        const isInvalidInputs = Object.values(invalidInputs).filter(value => value !== "");
        if (isInvalidInputs.length) {
            return;
        }

        const externalBankAccountData: ExternalAccountFormData = {
            accountNumber: data.accountNumber!,
            accountHolderName: data.fullName!,
            currency: data.currency!,
            accountCountry: data.bankCountry!,
            accountHolderType: data.holdetType! as "individual" | "company"
        }

        if (data.routingNumber) {
            externalBankAccountData.routingNumber = data.routingNumber;
        }


        if (props.externalAccountOnly) {
            props.submit.mutate(externalBankAccountData);
            return;
        }


        const [yyyy, mm, dd] = data.dob!.split("-");

        const bankAccountData: SetBankAccountPayload = {
            firstName: data.firstName!,
            lastName: data.lastName!,
            email: data.email!,
            dob: {
                day: Number(dd),
                month: Number(mm),
                year: Number(yyyy)
            },
            phoneNumber: `+${data.phoneNumber!}`,
            address: {
                country: data.country!,
                city: data.city!,
                postal_code: data.postalCode!,
                line1: data.line1!
            },
            ...externalBankAccountData
        }

        if (data.state) {
            bankAccountData.address.state = data.state;
        }

        if (data.line2) {
            bankAccountData.address.line2 = data.line2;
        }

        props.submit.mutate(bankAccountData);
    }

    return (
        <form onSubmit={setBankAccoountHandler} className="flex flex-col gap-8 bg-slate-200/50 px-3 py-4 rounded" noValidate>
            {props.externalAccountOnly ?
                null
                : <>
                    <div className="flex flex-col gap-4">
                        <h2 className="font-medium text-xl text-slate-800">General:</h2>
                        <div>
                            <div className="flex gap-4">
                                <Input errorMsg="" id="generalInfo_firstName" name="generalInfo_firstName" includeLabel isError={inputsErros.firstName !== ""} labelContent="First name*" type="text" />
                                <Input errorMsg="" id="generalInfo_lastName" name="generalInfo_lastName" includeLabel isError={inputsErros.lastName !== ""} labelContent="Last name*" type="text" />
                            </div>
                            <Input errorMsg={inputsErros.email} id="generalInfo_email" name="generalInfo_email" includeLabel isError={inputsErros.email !== ""} labelContent="Email*" type="email" />
                            <Input errorMsg={inputsErros.dob} id="generalInfo_dob" name="generalInfo_dob" includeLabel isError={inputsErros.dob !== ""} labelContent="Date of birth*" type="date" max={date} />
                            <Input errorMsg={inputsErros.phoneNumber} id="generalInfo_phoneNumber" name="generalInfo_phoneNumber" includeLabel isError={inputsErros.phoneNumber !== ""} labelContent="Phone number*" type="number" placeHolder="+1" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="font-medium text-xl text-slate-800">Address:</h2>
                        <div>
                            <div className="flex gap-4">
                                <Input errorMsg="" id="generalInfo_country" name="generalInfo_country" includeLabel isError={inputsErros.country !== ""} labelContent="Country*" type="text" placeHolder="(2 Letters)" />
                                <Input errorMsg="" id="generalInfo_city" name="generalInfo_city" includeLabel isError={inputsErros.city !== ""} labelContent="City*" type="text" />
                            </div>
                            <div className="flex gap-4">
                                <Input errorMsg="" id="generalInfo_state" name="generalInfo_state" includeLabel isError={inputsErros.state !== ""} labelContent="State" type="text" />
                                <Input errorMsg="" id="generalInfo_postalCode" name="generalInfo_postalCode" includeLabel isError={inputsErros.postalCode !== ""} labelContent="Postal code*" type="text" />
                            </div>
                            <Input errorMsg={inputsErros.line1} id="generalInfo_line1" name="generalInfo_line1" includeLabel isError={inputsErros.line1 !== ""} labelContent="Line 1*" type="text" />
                            <Input errorMsg={inputsErros.line2} id="generalInfo_line2" name="generalInfo_line2" includeLabel isError={inputsErros.line2 !== ""} labelContent="Line 2" type="text" />
                        </div>
                    </div>
                </>
            }
            <div className="flex flex-col gap-4">
                <h2 className="font-medium text-xl text-slate-800">Bank Information:</h2>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <input type="radio" name="bankInfo_holderType" id="bankInfo_holderType_individual" className="accent-purple-600" defaultChecked value="individual" />
                        <label htmlFor="bankInfo_holderType_individual" className="text-lg font-medium">Individual</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="radio" name="bankInfo_holderType" id="bankInfo_holderType_company" className="accent-purple-600" value="company" />
                        <label htmlFor="bankInfo_holderType_company" className="text-lg font-medium">Company</label>
                    </div>
                </div>
                <div>
                    <Input errorMsg={inputsErros.accountNumber} id="bankInfo_accountNumber" name="bankInfo_accountNumber" includeLabel isError={inputsErros.accountNumber !== ""} labelContent="Account number*" type="text" />
                    <Input errorMsg={inputsErros.routingNumber} id="bankInfo_routingNumber" name="bankInfo_routingNumber" includeLabel isError={inputsErros.routingNumber !== ""} labelContent="Routing number" type="number" />
                    <Input errorMsg={inputsErros.fullName} id="bankInfo_fullName" name="bankInfo_fullName" includeLabel isError={inputsErros.fullName !== ""} labelContent="Full name*" type="text" />
                    <div className="flex gap-4">
                        <Input errorMsg="" id="bankInfo_country" name="bankInfo_country" includeLabel isError={inputsErros.bankCountry !== ""} labelContent="Country*" type="text" placeHolder="(2 Letters)" />
                        <Input errorMsg="" id="bankInfo_currency" name="bankInfo_currency" includeLabel isError={inputsErros.currency !== ""} labelContent="Currency*" type="text" placeHolder="(3 Letters)" />
                    </div>
                </div>
            </div>
            <div className="flex justify-between">
                <PrimaryButton disabled={props.submit.isLoading} fullWith={false} justifyConent="center" style="solid" type="submit" x="lg" y="md" isLoading={props.submit.isLoading}>
                    {props.externalAccountOnly ? "Add External bank"
                        : "Submit Bank Account"
                    }
                </PrimaryButton>
                {props.externalAccountOnly ?
                    <button className="font-medium text-slate-700 px-1" onClick={props.onClose}>Cancel</button>
                    : null
                }
            </div>
        </form>
    )
}

export default FreelancerBankAccountForm