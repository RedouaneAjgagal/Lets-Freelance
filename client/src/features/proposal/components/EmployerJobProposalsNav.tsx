import SelectOptions from "../../../components/SelectOptions"

type EmployerJobProposalsNavProps = {
  onSelect: (payload: { name: string; value: string }) => void;
  selectedName: string;
}

const EmployerJobProposalsNav = (props: React.PropsWithoutRef<EmployerJobProposalsNavProps>) => {

  const filterOptions = [
    {
      name: "All",
      value: "all"
    },
    {
      name: "Pending",
      value: "pending"
    },
    {
      name: "In interview",
      value: "interviewing"
    },
    {
      name: "Rejected",
      value: "rejected"
    },
    {
      name: "Approved",
      value: "approved"
    }
  ];

  return (
    <nav className="p-4 flex justify-end items-center gap-2">
      <span className="font-medium text-slate-700">Filter by status</span>
      <div className="max-w-[9rem] w-full">
        <SelectOptions options={filterOptions} onSelect={props.onSelect} selectTitle={props.selectedName} isError={false} upperCaseEveryWord />
      </div>
    </nav>
  )
}

export default EmployerJobProposalsNav