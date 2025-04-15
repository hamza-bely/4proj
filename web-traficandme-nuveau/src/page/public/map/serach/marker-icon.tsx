import * as ReactDOM from "react-dom/client";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineGpsFixed } from "react-icons/md";

export type MarkerType = "Départ" | "Arrivée" | "Recherche" | "Position";

export const MarkerIcon = ({ type }: { type: MarkerType }) => {
    let bgColor = "bg-blue-500";
    let color = "white"
    let icon = null;

    switch (type) {
        case "Départ":
            bgColor = "";
            color = "red";
            icon = <FaMapMarkerAlt />;
            break;
        case "Arrivée":
            bgColor = "";
            color = "green";
            icon =<FaMapMarkerAlt   />;
            break;
        case "Recherche":
            bgColor = "bg-blue-500";
            icon = <FaMapMarkerAlt />;
            break;
        case "Position":
            bgColor = "bg-purple-600";
            icon = <MdOutlineGpsFixed />;
            break;
    }

    const extraClasses = type === "Position" ? "pulse-animation" : "";

    return (
        <div style={{color : `${color}`,fontSize : "25px"}} className={`${color}   ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${extraClasses}`}>
            {icon}
        </div>
    );
};

export const createMarkerDOMElement = (type: MarkerType): HTMLElement => {
    const container = document.createElement("div");
    const root = ReactDOM.createRoot(container);
    root.render(<MarkerIcon type={type} />);
    return container;
};

export default {
    MarkerIcon,
    createMarkerDOMElement
};