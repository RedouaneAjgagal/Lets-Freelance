import { useMutation } from '@tanstack/react-query';
import createPaymentMethod from '../services/createPaymentMethod';

const useCreatePaymentMethodMutation = () => {
    const createPaymentMethodMutation = useMutation({
        mutationFn: createPaymentMethod,
        retry: false
    });

    return createPaymentMethodMutation;
}

export default useCreatePaymentMethodMutation