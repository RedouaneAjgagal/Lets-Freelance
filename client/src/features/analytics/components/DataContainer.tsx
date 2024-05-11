type DataContainerProps = {
    data: {
        title: string;
        value: number | string;
    }[];
}

const DataContainer = (props: React.PropsWithoutRef<DataContainerProps>) => {

    return (
        <div>
            {props.data.map(data => (
                <div key={data.title} className="mx-6 mt-2 inline-flex flex-col border-b-2 border-purple-500 mb-8 pb-1">
                    <span className="font-bold text-2xl">{data.value.toLocaleString()}</span>
                    <h3 className="font-medium text-slate-700">{data.title}</h3>
                </div>
            ))}
        </div>
    )
}

export default DataContainer