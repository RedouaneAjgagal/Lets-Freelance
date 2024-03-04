import { useMutation, useQueryClient } from '@tanstack/react-query';
import submitProposal from '../service/submitProposal';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../hooks/redux';
import { useNavigate } from 'react-router-dom';

const useSubmitProposalMutation = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const submitProposalMutation = useMutation({
        mutationFn: submitProposal,
        retry: false,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["freelancerProposals", userInfo!.profileId] });
            queryClient.invalidateQueries({ queryKey: ["profileInfo"] });

            navigate("/profile/freelancer/proposals");

            toast.success(data.msg, {
                id: "success_submitProposal",
                duration: 3000
            });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_submitProposal",
                duration: 5000
            });
        }
    });

    return submitProposalMutation;
}

export default useSubmitProposalMutation