import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { createServiceAction } from "../redux/createService";
import InputContainer from "./InputContainer";
import FeaturedImage from "./FeaturedImage";
import Gallery from "./Gallery";
import CreateServiceWrapper from "./CreateServiceWrapper";

const CreateServiceStepOne = () => {
    const { title, category } = useAppSelector(state => state.createServiceReducer);
    const dispatch = useAppDispatch();

    const categories = ["Digital Marketing", "Design & Creative", "Programming & Tech", "Writing & Translation", "Video & Animation", "Finance & Accounting", "Music & Audio"] as const;

    const setTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(createServiceAction.setTitle(e.currentTarget.value));
    }

    const setCategoryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(createServiceAction.setCategory(e.currentTarget.value as typeof categories[number]));
    }

    return (
        <CreateServiceWrapper title="General">
            <InputContainer label="Title" error={title.error.msg}>
                <input name="Title" onChange={setTitleHandler} type="text" id="Title" value={title.value} className={`border-2 rounded outline-slate-400 px-2 py-1 ${title.error.msg ? "border-red-300 outline-red-300" : "border-slate-300"}`} />
            </InputContainer>
            <InputContainer label="Category" error={category.error.msg}>
                <select onChange={setCategoryHandler} name="Category" id="Category" className="border-2 rounded border-slate-300 outline-slate-400 p-1" value={category.value}>
                    {categories.map(category => (
                        <option key={category} value={category} >{category}</option>
                    ))}
                </select>
            </InputContainer>
            <FeaturedImage />
            <Gallery />
        </CreateServiceWrapper>
    )
}

export default CreateServiceStepOne