import { useState } from 'react';
import { PrimaryButton } from '../../../layouts/brand'
import BuyConnectsModal from '../Models/BuyConnectsModal';
import useOverflow from '../../../hooks/useOverflow';

type AddMoreConnectsProps = {
    connects: number;
}

const AddMoreConnects = (props: React.PropsWithoutRef<AddMoreConnectsProps>) => {
    const [isBuyConnectsOpen, setIsBuyConnectsOpen] = useState(false);
    
    const openBuyConnectsHandler = () => {
        setIsBuyConnectsOpen(prev => !prev);
    }
    
    useOverflow(isBuyConnectsOpen);

    return (
        <div>
            <PrimaryButton onClick={openBuyConnectsHandler} fullWith justifyConent='center' style='solid' type='button' x='md' y='md' disabled={false}>Add more connects</PrimaryButton>
            {
                isBuyConnectsOpen ?
                    <BuyConnectsModal onClose={() => setIsBuyConnectsOpen(false)} connects={props.connects} />
                    :
                    null
            }
        </div>
    )
}

export default AddMoreConnects