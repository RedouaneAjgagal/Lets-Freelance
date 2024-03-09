import { useState } from "react";
import ActionButton from "../../../layouts/brand/ActionButton";
import { FreelancerServiceType } from "../services/getFreelancerServices"
import { TbCategory, TbCalendar } from 'react-icons/tb'
import { useNavigate } from "react-router-dom";
import DeleteServiceModal from "../modals/DeleteServiceModal";
import useOverflow from "../../../hooks/useOverflow";
import { LuFileSignature } from "react-icons/lu";

type FreelancerServiceTableProps = {
    service: FreelancerServiceType;
}

const FreelancerServiceTable = (props: React.PropsWithoutRef<FreelancerServiceTableProps>) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const navigate = useNavigate();
    const viewServiceHander = () => {
        navigate(`/services/${props.service._id}`);
    }

    const editServicehandler = () => {
        navigate(`${props.service._id}/edit`);
    }

    const deleteServicehandler = () => {
        setIsDeleteModalOpen(true);
    }

    const contractNavigation = () => {
        navigate(`/profile/contracts?service_id=${props.service._id}`);
    }


    const postedAt = new Date(props.service.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    useOverflow(isDeleteModalOpen);

    return (
        <>
            {isDeleteModalOpen ?
                <DeleteServiceModal onCloseModal={() => setIsDeleteModalOpen(false)} serviceId={props.service._id} />
                : null
            }
            <tr className="border-t">
                <td className="p-2 py-4">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-medium text-[1.1rem]">{props.service.title}</h3>
                        <span className="text-sm text-slate-600 flex items-center gap-1">
                            <TbCategory size={18} />
                            {props.service.category}
                        </span>
                        <span className="text-sm text-slate-600 flex items-center gap-1">
                            <TbCalendar size={18} />
                            {postedAt}
                        </span>
                    </div>
                </td>
                <td className="p-2 py-4">{props.service.inQueue || "--"}</td>
                <td className="p-2 py-4">{props.service.totalRevenue ? `$${props.service.totalRevenue.toFixed(2)}` : "--"}</td>
                <td className="p-2 py-4">
                    <div className="flex gap-2">
                        <ActionButton onClick={viewServiceHander} type="view" minimized />
                        <ActionButton onClick={editServicehandler} type="edit" minimized />
                        <ActionButton onClick={deleteServicehandler} type="delete" minimized />
                        {props.service.hasContracts ?
                            <ActionButton onClick={contractNavigation} type="customized"  bgColor="bg-stone-600" icon={LuFileSignature} value="Contracts" />
                            : null
                        }
                    </div>
                </td>
            </tr>
        </>
    )
}

export default FreelancerServiceTable;