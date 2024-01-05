type TableHeadProps = {
    tableHeads: string[];
}

const TableHead = (props: React.PropsWithoutRef<TableHeadProps>) => {
    return (
        <thead>
            <tr>
                {props.tableHeads.map((tableHead, index) => <th key={index} className="min-w-[14rem] p-2 pb-4">{tableHead}</th>)}
            </tr>
        </thead>
    )
}

export default TableHead