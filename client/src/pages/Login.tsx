import { LoginForm } from "../features/auth"

const Login = () => {
    return (
        <main className="flex flex-col gap-8 px-2 pt-8 pb-20 bg-purple-100/50">
            <article className="text-center flex flex-col gap-2">
                <h1 className="text-3xl font-semibold">Login</h1>
                <p className="text-slate-600 leading-[1.6]">Gain access to a vibrant community of freelancers and employees</p>
            </article>
            <LoginForm />
        </main>
    )
}

export default Login