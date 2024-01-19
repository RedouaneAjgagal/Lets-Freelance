type TableHeadProps = {
    tableHeads: string[];
    width?: "tight" | "relaxed" | "wide" | "wider";
}

const TableHead = (props: React.PropsWithoutRef<TableHeadProps>) => {

    const widthTypes = {
        tight: "min-w-[8rem]",
        relaxed: "min-w-[12rem]",
        wide: "min-w-[14rem]",
        wider: "min-w-[18rem]"
    }

    const width = props.width ? widthTypes[props.width] : widthTypes.relaxed;

    return (
        <thead>
            <tr>
                {props.tableHeads.map((tableHead, index) => <th key={index} className={`${width} p-2 pb-4`}>{tableHead}</th>)}
            </tr>
        </thead>
    )
}

export default TableHead