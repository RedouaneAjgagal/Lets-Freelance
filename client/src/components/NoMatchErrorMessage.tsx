import notFoundImage from "/not_found.png";

const NoMatchErrorMessage = () => {
    return (
        <section className="flex flex-col gap-4 p-4 text-center items-center">
            <img src={notFoundImage} alt="search image" className="w-44 h-44" />
            <h2 className="text-purple-500 font-semibold text-2xl">There are no results that match your search.</h2>
            <p className="font-medium text-slate-500 mb-4">Please try adjusting your search keywords or filters.</p>
        </section>
    )
}

export default NoMatchErrorMessage