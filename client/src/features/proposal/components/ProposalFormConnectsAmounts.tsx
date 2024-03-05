
type ProposalFormConnectsAmountsProps = {
  jobConnects: number;
  freelancerConnects: number;
  boostedConnects: number;
  requiredTotalConnects: number;
  freelancerRemainingConnects: number;
}

const ProposalFormConnectsAmounts = (props: React.PropsWithoutRef<ProposalFormConnectsAmountsProps>) => {

  const requiredTotalConnects = props.jobConnects + parseInt(props.boostedConnects.toString());


  const remainingFreelancerConnects = props.freelancerConnects - requiredTotalConnects;


  const connectsAmountList = [
    {
      content: "Available connects",
      value: props.freelancerConnects
    },
    {
      content: "Required connects",
      value: props.jobConnects
    },
    {
      content: "Boosted connects",
      value: parseInt(props.boostedConnects.toString())
    },
    {
      content: "Total connects",
      value: requiredTotalConnects
    },
    {
      content: "Remaining connects",
      value: remainingFreelancerConnects
    }
  ];

  const connectsAmountContent = connectsAmountList.map(({ content, value }) => {
    return (
      <p key={content} className="text-sm last:mt-2">
        <span className="font-medium text-slate-500 mr-1">{`${content}:`}</span>
        <span className="font-semibold mr-1 text-slate-900 ">{value}</span>
      </p>
    )
  });

  return (
    <article className="absolute left-0 bottom-[4.3rem] flex flex-col gap-1">
      {connectsAmountContent}
    </article>
  )
}

export default ProposalFormConnectsAmounts