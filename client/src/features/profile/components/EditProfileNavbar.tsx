import { Link } from 'react-router-dom';
import { useIsMutating, useIsFetching } from '@tanstack/react-query';

interface Props {
    isAccountSettings: string | null;
}

const EditProfileNavbar = (props: React.PropsWithoutRef<Props>) => {
    const isUpdateProfileMutation = useIsMutating(["updateProfile"]);
    const isProfileInfoFetching = useIsFetching(["profileInfo"]);
    const isDisabled = isUpdateProfileMutation === 1 || isProfileInfoFetching === 1;

    const disableHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        isDisabled ? e.preventDefault() : null;
    }
    return (
        <nav className="flex items-center gap-5 border border-slate-300 rounded p-2">
            <Link onClick={disableHandler} to={"/profile/settings"} className={`text-slate-500 ${props.isAccountSettings ? "" : "underline text-slate-800"}`}>Public profile</Link>
            <Link to={"/profile/settings?account-settings=true"} className={`text-slate-500 ${props.isAccountSettings ? "underline text-slate-800" : ""}`}>Account</Link>
        </nav>
    )
}

export default EditProfileNavbar