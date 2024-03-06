import { TbCurrencyDollar } from "react-icons/tb";
import { GetEmployerJobProposalType } from "../service/getEmployerJobProposals"

type EmployerJobProposalPriceProps = {
    price: GetEmployerJobProposalType["price"];
    priceType: GetEmployerJobProposalType["priceType"];
}

const EmployerJobProposalPrice = (props: React.PropsWithoutRef<EmployerJobProposalPriceProps>) => {

    const budgetContent = `${props.priceType === "fixed" ?
        "Budget:" : "Hourly:"
        } $${props.price.toFixed(2)}`;

    return (
        <div className="flex items-center gap-1 text-slate-800">
            <TbCurrencyDollar size={20} />
            <strong className="font-medium">{budgetContent}</strong>
        </div>
    )
}

export default EmployerJobProposalPrice