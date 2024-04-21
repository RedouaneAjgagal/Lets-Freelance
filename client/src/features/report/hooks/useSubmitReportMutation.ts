import { useMutation } from '@tanstack/react-query';
import React from 'react'
import submitReport from '../services/submitReport';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const useSubmitReportMutation = () => {
    const submitReportMutation = useMutation({
        mutationFn: submitReport,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_submitReport",
                duration: 3000
            });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_submitReport",
                duration: 5000
            });
        }
    })

    return submitReportMutation;
}

export default useSubmitReportMutation