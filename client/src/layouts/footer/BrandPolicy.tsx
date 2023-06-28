import { AiFillFacebook, AiFillInstagram, AiFillTwitterSquare } from "react-icons/ai"
import { Link } from "react-router-dom"

const BrandPolicy = () => {
    return (
        <div className="flex flex-col font-medium gap-2 pb-6">
            <div className="flex gap-4">
                <Link to={"/"}>Terms of Service</Link>
                <Link to={"/"}>Privacy Policy</Link>
            </div>
            <div className="flex items-center gap-4 font-semibold">
                <h2>Follow Us</h2>
                <div className="flex items-center gap-4 text-2xl">
                    <Link to={"#"} target="_blank" rel="noopener"><AiFillFacebook /></Link>
                    <Link to={"#"} target="_blank" rel="noopener"><AiFillTwitterSquare /></Link>
                    <Link to={"#"} target="_blank" rel="noopener"><AiFillInstagram /></Link>
                </div>
            </div>
        </div>
    )
}

export default BrandPolicy