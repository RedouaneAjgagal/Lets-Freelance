import { useParams } from "react-router-dom";
import useCreateAdMutation from "../hooks/useCreateAdMutation";
import SingleAd from "./SingleAd"

type CreateAdProps = {
  onClose: () => void;
  tableContainerRef: React.RefObject<HTMLDivElement>;
}

const CreateAd = (props: React.PropsWithoutRef<CreateAdProps>) => {
  const { campaignId } = useParams();

  const createAdMutation = useCreateAdMutation({
    campaignId: campaignId!
  });

  return (
    <SingleAd type="create" onClose={props.onClose} submitAd={createAdMutation} campaignId={campaignId!} tableContainerRef={props.tableContainerRef} />
  )
}

export default CreateAd