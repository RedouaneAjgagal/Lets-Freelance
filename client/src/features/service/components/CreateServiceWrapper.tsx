import React from 'react'

type CreateServiceWrapperProps = {
    title: string;
}

const CreateServiceWrapper = (props: React.PropsWithChildren<CreateServiceWrapperProps>) => {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="font-medium text-xl border-b-2 pb-2 border-slate-500">{props.title}</h2>
            <div>
                {props.children}
            </div>
        </section>
    )
}

export default CreateServiceWrapper