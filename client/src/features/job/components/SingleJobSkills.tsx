import Tag from "../../../components/Tag";
import toUpperCase from "../../../utils/toUpperCase";
import { SingleJobType } from "../service/getSingleJob"

type SingleJobSkillsProps = {
    tags: SingleJobType["tags"];
}

const SingleJobSkills = (props: React.PropsWithoutRef<SingleJobSkillsProps>) => {

    const tags = props.tags.map((tag, index) => {
        const toUpperCaseTag = toUpperCase({ value: tag });

        return (
            <Tag key={index} clickable={false} value={toUpperCaseTag} />
        )
    });

    return (
        <section className="flex flex-col gap-3">
            <h3 className="text-xl font-medium text-slate-800">Skills and Expertise</h3>
            <div className="flex items-center gap-3 flex-wrap">
                {tags}
            </div>
        </section>
    )
}

export default SingleJobSkills