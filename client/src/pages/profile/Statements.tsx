import { useProfileStatementsQuery } from "../../features/profile";
const Statements = () => {

    const profileStatements = useProfileStatementsQuery();
    console.log(profileStatements.data);

    return (
        <div>Statements</div>
    )
}

export default Statements;