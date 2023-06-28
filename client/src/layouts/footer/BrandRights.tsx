
const BrandRights = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div className="pt-6 text-slate-200/80">
            <p>© {currentYear} - Lets Freelance. All rights reserved.</p>
        </div>
    )
}

export default BrandRights