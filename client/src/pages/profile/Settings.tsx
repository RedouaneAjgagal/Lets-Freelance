import { useSearchParams } from "react-router-dom"
import { PublicProfileForm, AccountForm, EditProfileNavbar } from "../../features/profile"

const Settings = () => {

  const [searchParams] = useSearchParams();
  const isAccountSettings = searchParams.get("account-settings");

  return (
    <main className="p-4 bg-purple-100/30 grid gap-4">
      <EditProfileNavbar isAccountSettings={isAccountSettings} />
      <h1 className="text-3xl font-semibold text-purple-800 leading-[1.3]">Edit Profile</h1>
      {isAccountSettings ?
        <AccountForm />
        :
        <PublicProfileForm />
      }
    </main>
  )
}

export default Settings