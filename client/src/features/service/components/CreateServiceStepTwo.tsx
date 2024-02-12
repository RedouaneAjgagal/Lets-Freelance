import CreateServiceWrapper from "./CreateServiceWrapper"
import "react-quill/dist/quill.snow.css";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { createServiceAction } from "../redux/createService";
import DescriptionRichTextEditor from "./DescriptionRichTextEditor";
import CreateServiceKeywords from "./CreateServiceKeywords";


const CreateServiceStepTwo = () => {
  const { description, keywords } = useAppSelector(state => state.createServiceReducer);
  const dispatch = useAppDispatch();

  const setDescriptionHandler = (value: string, plainText: string) => {
    dispatch(createServiceAction.setDescription({
      value,
      plainText
    }));
  }

  const setKeywordHandler = ({ id, keyword }: { id: string; keyword: string }) => {
    dispatch(createServiceAction.setKeywords({
      keyword: {
        id,
        keyword
      }
    }));
  }

  const removeKeywordHandler = (keywordId: string) => {
    dispatch(createServiceAction.removeKeyword({
      keywordId
    }));
  }

  return (
    <CreateServiceWrapper title="Details">
      <DescriptionRichTextEditor error={description.error.msg} onChange={setDescriptionHandler} textValue={description.value} />
      <CreateServiceKeywords error={keywords.error.msg} keywords={keywords.value} setKeyword={setKeywordHandler} onRemoveKeyword={removeKeywordHandler} />
    </CreateServiceWrapper>
  )
}

export default CreateServiceStepTwo