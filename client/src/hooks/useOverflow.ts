import { useEffect } from "react";

const useOverflow = (isHidden: boolean) => {
    useEffect(() => {
        if (isHidden) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isHidden]);
}

export default useOverflow 