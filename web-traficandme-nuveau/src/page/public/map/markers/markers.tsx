import { useEffect, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import { Alert } from "../../../../assets/kit-ui/alert.tsx";
import { Input } from "../../../../assets/kit-ui/input.tsx";
import PopupContent from "./popup-content.tsx";
import { createRoot } from "react-dom/client";
import { getUserRole } from "../../../../services/service/token-service.tsx";
import Cookies from "js-cookie";

interface Signal {
    type: string;
    position: [number, number];
    info: {
        user: string;
        status: "Available" | "Unavailable" | "Canceled" | "Pending";
        creteDate: string;
    };
}

interface MarkersProps {
    map: tt.Map | null;
}

const Markers: React.FC<MarkersProps> = ({ map }) => {
    const [signals, setSignals] = useState<Signal[]>([
        { type: "Danger", position: [2.3522, 48.8566], info: { status: "Available", user: "ghhaz", creteDate: "" } },
        { type: "Police", position: [2.3622, 48.8566], info: { status: "Unavailable", user: "ghhaz", creteDate: "" } },
        { type: "Police", position: [2.3622, 45.8566], info: { status: "Available", user: "ghhaz", creteDate: "" } }
    ]);
    const token = Cookies.get("authToken");
    const [userRole, setRole] = useState<string | string[] | null>(null);
    const [newMarkerPos, setNewMarkerPos] = useState<[number, number] | null>(null);
    const [newMarkerInfo, setNewMarkerInfo] = useState({ type: "", user: "", status: "" });
    const [showModal, setShowModal] = useState(false);
    const [isAddingMarker, setIsAddingMarker] = useState(false);
    useEffect(() => {
        setRole(getUserRole());

        if (!map) return;

        const createdMarkers: tt.Marker[] = [];

        signals.forEach((signal) => {
            const coordinates = signal.position;
            const markerElement = document.createElement("div");
            markerElement.className = "rounded-full overflow-hidden shadow-lg border-2 border-white";
            markerElement.style.marginBottom = "50px";

            markerElement.innerHTML = `
                <img src="/images/icon-map/police.jpg" alt="User Avatar" class="rounded-full w-10 h-10 border-2 border-white shadow-md" />
            `;

            const marker = new tt.Marker({ element: markerElement })
                .setLngLat(coordinates)
                .addTo(map);

            const popupContainer = document.createElement("div");
            popupContainer.style.marginBottom = "10px";

            const root = createRoot(popupContainer);

            root.render(
                <PopupContent
                    type={signal.type}
                    user={signal.info.user}
                    creteDate={signal.info.creteDate}
                />
            );

            const popup = new tt.Popup({ offset: { bottom: [0, -40] } }).setDOMContent(popupContainer);

            marker.getElement().addEventListener("mouseover", () => {
                marker.setPopup(popup).togglePopup();
            });

            marker.getElement().addEventListener("mouseout", () => {
                marker.setPopup(popup).removePopup();
            });

            createdMarkers.push(marker);
        });

        const handleMapClick = (event: tt.EventData) => {
            if (isAddingMarker && userRole) {
                const { lng, lat } = event.lngLat;
                setNewMarkerPos([lng, lat]);
                setShowModal(true);
                setIsAddingMarker(false);
            }
        };

        map.on("click", handleMapClick);

        return () => {
            createdMarkers.forEach((marker) => marker.remove());
            map.off("click", handleMapClick);
        };
    }, [map, signals, isAddingMarker,token]);

    const handleAddMarker = () => {
        if (!newMarkerPos) return;

        const newSignal: Signal = {
            type: newMarkerInfo.type,
            position: newMarkerPos,
            info: { name: newMarkerInfo.type, user: newMarkerInfo.user, status: newMarkerInfo.status, avatarUrl: newMarkerInfo.status }
        };

        setSignals([...signals, newSignal]);
        setShowModal(false);
        setNewMarkerInfo({ type: "", user: "", status: "" });
    };

    return (
        <>
            <Alert open={showModal} onClose={setShowModal}>
                <div className="bg-white p-6 rounded-lg w-96 animate-fadeIn">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Ajouter un marqueur</h2>

                    <label className="block  text-gray-700">Type:
                        <Input name="full_name mt-2" value={newMarkerInfo.type} onChange={(e) => setNewMarkerInfo({ ...newMarkerInfo, type: e.target.value })} />
                    </label>

                    <div className="flex justify-end mt-4">
                        <button className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={() => setShowModal(false)}>Annuler</button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddMarker}>Ajouter</button>
                    </div>
                </div>
            </Alert>
            {userRole && <button
                style={{zIndex:"1001"}}
                onClick={() => setIsAddingMarker(true)}
                className="fixed bottom-10 right-10 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600"
            >+
            </button>}
        </>
    );
};

export default Markers;
