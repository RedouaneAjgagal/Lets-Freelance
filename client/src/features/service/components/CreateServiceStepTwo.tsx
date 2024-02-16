import CreateServiceWrapper from "./CreateServiceWrapper"
import "react-quill/dist/quill.snow.css";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { serviceFormAction } from "../redux/serviceForm";
import DescriptionRichTextEditor from "./DescriptionRichTextEditor";
import CreateServiceKeywords from "./CreateServiceKeywords";

type CreateServiceStepTwoProps = {
  formType: "create" | "update";
}

const CreateServiceStepTwo = (props: React.PropsWithoutRef<CreateServiceStepTwoProps>) => {
  const { description, keywords } = useAppSelector(state => state.serviceFormReducer);
  const dispatch = useAppDispatch();

  const setDescriptionHandler = (value: string, plainText: string) => {
    dispatch(serviceFormAction.setDescription({
      value,
      plainText
    }));
  }

  const setKeywordHandler = ({ id, keyword }: { id: string; keyword: string }) => {
    dispatch(serviceFormAction.setKeywords({
      keyword: {
        id,
        keyword
      }
    }));
  }

  const removeKeywordHandler = (keywordId: string) => {
    dispatch(serviceFormAction.removeKeyword({
      keywordId
    }));
  }

  return (
    <CreateServiceWrapper title="Details">
      <DescriptionRichTextEditor error={description.error.msg} onChange={setDescriptionHandler} textValue={description.value} />
      {props.formType === "create" ?
        <CreateServiceKeywords error={keywords.error.msg} keywords={keywords.value} setKeyword={setKeywordHandler} onRemoveKeyword={removeKeywordHandler} />
        : null
      }
    </CreateServiceWrapper>
  )
}

export default CreateServiceStepTwo