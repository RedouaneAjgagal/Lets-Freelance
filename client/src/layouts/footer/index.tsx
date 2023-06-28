import BrandPolicy from "./BrandPolicy";
import BrandRessources from "./BrandRessources";
import BrandRights from "./BrandRights";

const index = () => {

    return (
        <footer className="bg-purple-100/30">
            <div className="grid text-white bg-purple-800 px-4 py-6 rounded-t-xl">
                <BrandPolicy />
                <BrandRessources />
                <BrandRights />
            </div>
        </footer>
    )
}

export default index