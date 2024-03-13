import { useMutation, useQueryClient } from '@tanstack/react-query';
import submitWorkedHours from '../services/submitWorkedHours';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';

const useSubmitWorkedHoursMutation = () => {
    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const { userInfo } = useAppSelector(state => state.authReducer);
    const { contractId } = useParams();

    const submitWorkedHoursMutation = useMutation({
        mutationFn: submitWorkedHours,
        retry: false,
        onSuccess: (data) => {
            toast.success(`${data.workedHours} hours has been submitted`, {
                id: "success_submitWorkedHours",
                duration: 3000
            });

            queryClient.invalidateQueries({ queryKey: ["singleContract", contractId, userInfo!.profileId] });

            navigate("./..");
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_submitWorkedHours",
                duration: 5000
            });
        }
    });

    return submitWorkedHoursMutation;
}

export default useSubmitWorkedHoursMutation