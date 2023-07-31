import { Navigate, useSearchParams } from "react-router-dom"
import { PublicProfileForm, AccountForm, EditProfileNavbar, useProfileInfoQuery } from "../../features/profile";
import Loading from "../../components/Loading";
import { useAppSelector } from "../../hooks/redux";
const Settings = () => {
  const { userInfo } = useAppSelector(state => state.authReducer);

  const [searchParams] = useSearchParams();
  const isAccountSettings = searchParams.get("account-settings");

  const profileInfoQuery = useProfileInfoQuery();

  return (
    userInfo ?
      <main className="p-4 bg-purple-100/30 grid gap-4">
        <EditProfileNavbar isAccountSettings={isAccountSettings} />
        <h1 className="text-3xl font-semibold text-purple-800 leading-[1.3]">Edit Profile</h1>
        {profileInfoQuery.isLoading ?
          <Loading />
          :
          isAccountSettings ?
            <AccountForm role={profileInfoQuery.data!.data.userAs} />
            :
            <PublicProfileForm profileInfo={profileInfoQuery.data!.data} />

        }
      </main>
      :
      <Navigate to="/auth/login" />
  )
}

export default Settings