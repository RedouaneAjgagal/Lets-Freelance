const formatProfileName = (name: string) => {
    const [firstName, secondName] = name.split(" ");

    const formatedProfileName = `${firstName.slice(0, 1).toUpperCase()}${firstName.slice(1)} ${secondName !== undefined ? `${secondName.slice(0, 1).toUpperCase()}.` : ""}`;

    return formatedProfileName;
}

export default formatProfileName;