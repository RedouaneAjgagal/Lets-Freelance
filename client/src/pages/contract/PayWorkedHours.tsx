import { Link, useParams, useSearchParams } from "react-router-dom"
import { useSetAsPaidHoursQuery } from "../../features/contract"
import Loading from "../../components/Loading";
import { AxiosError } from "axios";
import { BiArrowBack } from "react-icons/bi";


const PayWorkedHours = () => {
    const { contractId } = useParams();

    const [URLSearchParams] = useSearchParams();

    const session_id = URLSearchParams.get("session_id");

    if (!session_id) {
        throw new Error("Unauthorized action");
    }

    const setAsPaidHoursQuery = useSetAsPaidHoursQuery({
        contractId: contractId!,
        session_id
    });

    console.log();


    return (
        <main className="flex flex-col gap-4 p-4">
            <h1 className="text-xl font-semibold">Pay worked hours</h1>
            <div className="flex flex-col gap-1">
                <small>Contract ID: {contractId}</small>
                {
                    setAsPaidHoursQuery.isLoading ?
                        <Loading />
                        : setAsPaidHoursQuery.isSuccess ?
                            <section className="p-4 bg-green-100 rounded flex flex-col gap-2">
                                <h2 className="text-green-600 font-medium text-lg">Success</h2>
                                <p className="text-slate-600">{setAsPaidHoursQuery.data.msg}</p>
                                <Link to={`/profile/contracts/${setAsPaidHoursQuery.data.contractId}`} className="flex items-center gap-1 self-start">
                                    <BiArrowBack />
                                    Back
                                </Link>
                            </section>
                            : <section className="p-4 bg-red-100 rounded flex flex-col gap-2">
                                <h2 className="text-red-600 font-medium text-lg">Failed</h2>
                                <p className="text-slate-600">
                                    {(setAsPaidHoursQuery.error as AxiosError<{ msg: string }>).response?.data.msg}
                                </p>
                                <Link to={`/profile/contracts/${contractId}`} className="flex items-center gap-1 self-start">
                                    <BiArrowBack />
                                    Back
                                </Link>
                            </section>
                }
            </div>
        </main>
    )
}

export default PayWorkedHours