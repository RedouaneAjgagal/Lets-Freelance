import { useSearchParams } from "react-router-dom"
import { PublicProfileForm, AccountForm, EditProfileNavbar, useProfileInfoQuery } from "../../features/profile";
import Loading from "../../components/Loading";

const Settings = () => {
  const [searchParams] = useSearchParams();
  const isAccountSettings = searchParams.get("account-settings");

  const profileInfoQuery = useProfileInfoQuery();

  return (
    <main className="p-4 grid gap-4">
      <EditProfileNavbar isAccountSettings={isAccountSettings} />
      <h1 className="text-3xl font-semibold text-purple-800 leading-[1.3]">Edit Profile</h1>
      {profileInfoQuery.isLoading
        ? <Loading withoutBackground />
        : isAccountSettings
          ? <AccountForm />
          : <PublicProfileForm profileInfo={profileInfoQuery.data!.data} />
      }
    </main>
  )
}

export default Settings