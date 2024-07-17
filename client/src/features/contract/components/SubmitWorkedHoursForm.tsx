import { Link } from "react-router-dom"
import Input from "../../../components/Input"
import { PrimaryButton } from "../../../layouts/brand"
import { useState } from "react";
import useSubmitWorkedHoursMutation from "../hooks/useSubmitWorkedHoursMutation";

type SubmitWorkedHoursFormProps = {
    hourlyPrice: number;
    contractId: string
}

const SubmitWorkedHoursForm = (props: React.PropsWithoutRef<SubmitWorkedHoursFormProps>) => {
    const submitWorkedHoursMutation = useSubmitWorkedHoursMutation();

    const [workedHoursError, setWorkedHoursError] = useState("");


    const submitWorkedHoursHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (submitWorkedHoursMutation.isLoading) return;

        const formData = new FormData(e.currentTarget);

        const workedHours = formData.get("worked_hours")?.toString();
        if (!workedHours || workedHours.trim() === "") {
            setWorkedHoursError("Required, can't be empty");
            return;
        }

        const workedHoursNumber = Number(workedHours);

        const isInvalidNumber = Number.isNaN(workedHoursNumber);
        if (isInvalidNumber) {
            setWorkedHoursError("Invalid number");
            return;
        }

        const isIntegerNumber = Number.isInteger(workedHoursNumber);
        if (!isIntegerNumber) {
            setWorkedHoursError("Must be an integer number");
            return;
        }

        if (workedHoursNumber < 1) {
            setWorkedHoursError("Can't be less than 1 hour");
            return;
        }

        setWorkedHoursError("");

        submitWorkedHoursMutation.mutate({
            contractId: props.contractId,
            workedHours: workedHoursNumber
        });
    }

    return (
        <form onSubmit={submitWorkedHoursHandler} className="p-3 bg-slate-200/20 border rounded lg:p-5" noValidate>
            <span className="text-slate-700 text-sm flex mb-1">${props.hourlyPrice.toFixed(2)} /hr</span>
            <Input errorMsg={workedHoursError} id="worked_hours" includeLabel={true} labelContent="Worked hours" isError={workedHoursError !== ""} name="worked_hours" type="number" defaultValue={""} />
            <div className="flex items-center justify-between">
                <Link className="underline text-slate-600" to={`./..`}>Cancel</Link>
                <PrimaryButton disabled={submitWorkedHoursMutation.isLoading} fullWith={false} justifyConent="center" style="solid" type="submit" x="lg" y="md" isLoading={submitWorkedHoursMutation.isLoading}>Submit</PrimaryButton>
            </div>
        </form>
    )
}

export default SubmitWorkedHoursForm