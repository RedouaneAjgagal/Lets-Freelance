import WhyUs from "./WhyUs"

const whyUsData = [
    {
        img: "https://cdn-icons-png.flaticon.com/512/1851/1851036.png",
        title: "Proof of quality",
        desc: "Check any pro's work samples, client reviews, and identity verification."
    },
    {
        img: "https://cdn-icons-png.flaticon.com/512/2980/2980950.png",
        title: "No cost until you hire",
        desc: "Interview potential fits for your job, negotiate rates, and only pay for work you approve."
    },
    {
        img: "https://cdn-icons-png.flaticon.com/512/2058/2058432.png",
        title: "Safe and secure",
        desc: "Focus on your work knowing we help protect your data and privacy. We're here with 24/7 support if you need it."
    },
]

const WhyUsProofList = () => {
    return (
        <ul className="mt-4 grid gap-6">
            {whyUsData.map((data) => <WhyUs key={data.title} info={data} />)}
        </ul>
    )
}

export default WhyUsProofList