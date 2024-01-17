import { useState } from 'react';
import Overlay from '../../../layouts/Overlay'
import { PrimaryButton } from '../../../layouts/brand';
import { createPortal } from 'react-dom';
import useBuyConnectsMutation from '../hooks/useBuyConnectsMutation';

type BuyConnectsModalProps = {
    connects: number;
    onClose: () => void;
}

const BuyConnectsModal = (props: React.PropsWithoutRef<BuyConnectsModalProps>) => {
    const buyConnectsMutation = useBuyConnectsMutation();
    const [connectsOption, setConnectsOption] = useState<number>(10);

    const connectPrice = 0.34;

    const connectsOptions = [10, 25, 50, 75, 100];

    const options = connectsOptions.map(connects => {
        const calcTotal = (connects * connectPrice).toFixed(2);
        const optionName = `${connects} for $${calcTotal}`;
        return <option key={connects} value={connects}>{optionName}</option>
    });

    const selectAmountHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setConnectsOption(Number(e.currentTarget.value));
    }

    const chargedAmount = (connectsOption * connectPrice).toFixed(2);
    const newConnectsBalance = props.connects + connectsOption;

    const buyConnectsHandler = () => {
        console.log({ connects: connectsOption });
        buyConnectsMutation.mutate({
            connects: connectsOption
        });
    }

    return (
        createPortal(
            <>
                <Overlay onClose={props.onClose} />
                <section className='fixed w-[90%] bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded shadow-lg flex flex-col gap-5'>
                    <h2 className="text-3xl font-semibold mb-3">Buy connects</h2>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-slate-600 font-medium">Your available connects</h3>
                        <span className="text-lg font-medium">{props.connects}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-slate-600 font-medium">Select the amount to buy</h3>
                        <select name="amount_to_buy" className="w-full border rounded p-2" onChange={selectAmountHandler}>
                            {options}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-slate-600 font-medium">Your account will be charged</h3>
                        <span className="text-lg font-medium">{`$${chargedAmount}`}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-slate-600 font-medium">Your new connects balance will be</h3>
                        <span className="text-lg font-medium">{newConnectsBalance}</span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600"><span className="text-orange-600 font-medium">Important:</span> Connects are non refundable</p>
                    </div>
                    <div className='flex justify-end gap-4'>
                        <button className="text-purple-800 font-medium" onClick={props.onClose}>Cancel</button>
                        <PrimaryButton disabled={buyConnectsMutation.isLoading} fullWith={false} justifyConent='center' style='solid' type='button' x='lg' y='lg' onClick={buyConnectsHandler}>Buy Connects</PrimaryButton>
                    </div>
                </section>
            </>
            ,
            document.getElementById("overlay")!

        )
    )
}

export default BuyConnectsModal