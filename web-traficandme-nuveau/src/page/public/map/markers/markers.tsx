import { useEffect, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import {Alert} from "../../../../assets/kit-ui/alert.tsx";
import {Input} from "../../../../assets/kit-ui/input.tsx";

interface Signal {
    type: string;
    position: [number, number];
    info: {
        name: string;
        user: string;
        status: string;
        avatarUrl : string;
    };
}

interface MarkersProps {
    map: tt.Map | null;
}

const Markers: React.FC<MarkersProps> = ({ map }) => {
    const [signals, setSignals] = useState<Signal[]>([
        { type: "dange", position: [2.3522, 48.8566], info: { name: "dange", user: "ghhaz", status: "confirmed", avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg" } },
        { type: "police", position: [2.3622, 48.8566], info: { name: "police", user: "ghhaz", status: "confirmed", avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg" } },
        { type: "police", position: [2.3622, 45.8566], info: { name: "police", user: "ghhaz", status: "confirmed", avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg" } }
    ]);

    const [newMarkerPos, setNewMarkerPos] = useState<[number, number] | null>(null);
    const [newMarkerInfo, setNewMarkerInfo] = useState({ type: "", user: "", status: "" });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!map) return;

        const createdMarkers: tt.Marker[] = [];

        signals.forEach((signal) => {
            const coordinates = signal.position;
            const markerElement = document.createElement("div");
            markerElement.className = "rounded-full overflow-hidden shadow-lg border-2 border-white";

            markerElement.innerHTML = `
                <img src="/images/icon-map/police.jpg" alt="User Avatar" class="rounded-full w-10 h-10 border-2 border-white shadow-md" />
            `;


            const marker = new tt.Marker({ element: markerElement })
                .setLngLat(coordinates)
                .addTo(map);

            const popupContent = `
                <h3>${signal.info.name}</h3>
                <p>User: ${signal.info.user}</p>
                <p>Status: ${signal.info.status}</p>
            `;
            const popup = new tt.Popup().setHTML(popupContent);

            marker.getElement().addEventListener("mouseover", () => {
                marker.setPopup(popup).togglePopup();
            });

            marker.getElement().addEventListener("mouseout", () => {
                marker.setPopup(popup).removePopup();
            });

            createdMarkers.push(marker);
        });

        const handleMapClick = (event: tt.EventData) => {
            const { lng, lat } = event.lngLat;
            setNewMarkerPos([lng, lat]);
            setShowModal(true);
        };

        map.on("click", handleMapClick);

        return () => {
            createdMarkers.forEach((marker) => marker.remove());
            map.off("click", handleMapClick);
        };
    }, [map, signals]);

    const handleAddMarker = () => {
        if (!newMarkerPos) return;

        const newSignal: Signal = {
            type: newMarkerInfo.type,
            position: newMarkerPos,
            info: { name: newMarkerInfo.type, user: newMarkerInfo.user, status: newMarkerInfo.status , avatarUrl : newMarkerInfo.status}
        };

        setSignals([...signals, newSignal]);
        setShowModal(false);
        setNewMarkerInfo({ type: "", user: "", status: "" });
    };

    return (
        <>
            <Alert open={showModal} onClose={setShowModal}>
                <div className="bg-white p-6 rounded-lg  w-96 animate-fadeIn">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Ajouter un marqueur</h2>

                    <label className="block mb-2 text-gray-700">Type:
                        <Input name="full_name" value={newMarkerInfo.type}  onChange={(e) => setNewMarkerInfo({ ...newMarkerInfo, type: e.target.value })} />
                    </label>

                    <label className="block mb-2 text-gray-700">Utilisateur:
                        <Input name="full_name"  value={newMarkerInfo.user} onChange={(e) => setNewMarkerInfo({ ...newMarkerInfo, user: e.target.value })}  />
                    </label>

                    <label className="block mb-2 text-gray-700">Statut:
                        <Input name="full_name" value={newMarkerInfo.status}  onChange={(e) => setNewMarkerInfo({ ...newMarkerInfo, status: e.target.value })} />
                    </label>

                    <div className="flex justify-end mt-4">
                        <button className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={() => setShowModal(false)}>Annuler</button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddMarker}>Ajouter</button>
                    </div>
                </div>
            </Alert>
        </>
    );
};

export default Markers;
