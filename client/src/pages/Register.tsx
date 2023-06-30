import { Link } from "react-router-dom"
import { RegisterForm } from "../features/auth"

const Register = () => {
    return (
        <main className="flex flex-col gap-8 px-2 pt-8 pb-20 bg-purple-100/50">
            <article className="text-center flex flex-col gap-2">
                <h1 className="text-3xl font-semibold">Register</h1>
                <p className="text-slate-600 leading-[1.6]">Join us now, hundreds of Freelancers & Employees right now on Lets Freelance</p>
            </article>
            <div className="flex flex-col gap-4">
                <RegisterForm />
                <p className="text-slate-600 text-center">Already have an account? <Link to="/auth/login" className="text-purple-600 font-medium">Log In</Link></p>
            </div>
        </main>
    )
}

export default Register