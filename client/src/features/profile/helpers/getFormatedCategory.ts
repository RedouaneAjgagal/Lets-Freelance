export type Category = "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";

const getFormatedCategory = (category: Category) => {
    const getCategory = {
        "digital marketing": "digital-marketing",
        "design & creative": "design-creative",
        "programming & tech": "programming-tech",
        "writing & translation": "writing-translation",
        "video & animation": "video-animation",
        "finance & accounting": "finance-accounting",
        "music & audio": "music-audio"
    } as const;

    const formatedCategory = getCategory[category];
    return formatedCategory;
}

export default getFormatedCategory;