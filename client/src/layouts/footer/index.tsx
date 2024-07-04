import BrandPolicy from "./BrandPolicy";
import BrandRessources from "./BrandRessources";
import BrandRights from "./BrandRights";

const index = () => {

    return (
        <footer className="bg-purple-800 text-white xl:rounded xl:m-4">
            <div className="grid px-4 py-6 rounded-t-xl xl:p-8">
                <BrandPolicy />
                <BrandRessources />
                <BrandRights />
            </div>
        </footer>
    )
}

export default index