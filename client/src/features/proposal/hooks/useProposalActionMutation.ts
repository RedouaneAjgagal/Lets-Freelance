import { useMutation, useQueryClient } from '@tanstack/react-query'
import proposalAction from '../service/proposalAction'
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';

const useProposalActionMutation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { userInfo } = useAppSelector(state => state.authReducer);
    const { jobId } = useParams();

    const proposalActionMutation = useMutation({
        mutationFn: proposalAction,
        retry: false,
        onSuccess: (data) => {
            if (data.status === "approved" && data.priceType === "fixed") {
                window.open(data.url, "_blank", "noopener noreferrer");
                return;
            }

            if (data.status === "interviewing") {
                queryClient.removeQueries({ queryKey: ["messages", userInfo!.userId] })
                navigate("/profile/messages");
                // window.open("/profile/messages", "_blank", "noopener noreferrer");
            }

            queryClient.invalidateQueries({ queryKey: ["employerProposals", userInfo!.profileId, jobId] });

            toast.success(data.msg, {
                id: "success_proposalAction",
                duration: 3000
            });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_proposalAction",
                duration: 5000
            });
        }
    });

    return proposalActionMutation
}

export default useProposalActionMutation