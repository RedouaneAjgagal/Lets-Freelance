import { useState } from "react";

type Categories = "all-categories" | "programming-tech" | "design-creative" | "digital-marketing" | "writing-translation" | "video-animation" | "finance-accounting" | "music-audio";

type CategoryFilterProps = {
    SIZE: number;
    onSelectCategory: (category: Categories) => void;
    category?: Categories;
}

type CategoryType = {
    label: string;
    value: string;
};

const CategoryFilter = (props: React.PropsWithoutRef<CategoryFilterProps>) => {
    const [size, setSize] = useState(props.SIZE);

    const categories: CategoryType[] = [
        {
            label: "All Categories",
            value: "all-categories"
        },
        {
            label: "Programming & Tech",
            value: "programming-tech"
        },
        {
            label: "Design & Creative",
            value: "design-creative"
        },
        {
            label: "Digital Marketing",
            value: "digital-marketing"
        },
        {
            label: "Writing & Translation",
            value: "writing-translation"
        },
        {
            label: "Video & Animation",
            value: "video-animation"
        },
        {
            label: "Finance & Accounting",
            value: "finance-accounting"
        },
        {
            label: "Music & Audio",
            value: "music-audio"
        }
    ];

    const selectCategoryHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const validCategories = categories.map(category => category.value);
        const category = e.currentTarget.value as "all-categories" | "programming-tech" | "design-creative" | "digital-marketing" | "writing-translation" | "video-animation" | "finance-accounting" | "music-audio";

        // check if valid category value
        if (!validCategories.includes(category)) {
            return;
        };

        props.onSelectCategory(category);
    }

    const formatedCategories = categories.map((category, index) => {
        if ((index + 1) > size) {
            return;
        }
        return (
            <label key={category.label} className="flex gap-2">
                <input type="radio" value={category.value} className="accent-purple-600" onChange={selectCategoryHandler} checked={props.category ? category.value === props.category : category.value === "all-categories"} />
                {category.label}
            </label>
        )
    });

    const seeMoreCategoriesHandler = () => {
        setSize((prev) => {
            if (categories.length === prev) {
                return props.SIZE;
            } else {
                return categories.length;
            }
        });
    }

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl lg:font-semibold">Categories</h4>
            <div className="flex flex-col gap-2">
                {formatedCategories}
                <div>
                    <button type="button" onClick={seeMoreCategoriesHandler} className="text-[1rem] text-purple-700">
                        {categories.length > size ?
                            `See ${categories.length - size} more`
                            :
                            "Show less"
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoryFilter