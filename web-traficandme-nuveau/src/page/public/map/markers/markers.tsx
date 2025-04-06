import { useEffect, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import { Alert } from "../../../../assets/kit-ui/alert.tsx";
import PopupContent from "./popup-content.tsx";
import { getUserRole } from "../../../../services/service/token-service.tsx";
import Cookies from "js-cookie";
import { IoMdClose } from "react-icons/io";

interface Signal {
    type: string;
    position: [number, number];
    info: {
        user: string;
        status: "Available" | "Unavailable" | "Canceled" | "Pending";
        creteDate: string;
        like: number;
        dislike: number;
    };
}

interface MarkersProps {
    map: tt.Map | null;
}

const Markers: React.FC<MarkersProps> = ({ map }) => {
    const [signals, setSignals] = useState<Signal[]>([
        { type: "Danger", position: [2.3522, 48.8566], info: { status: "Available", user: "hamza33", creteDate: "202", like: 22, dislike: 5 } },
        { type: "Police", position: [2.3622, 48.8566], info: { status: "Unavailable", user: "hamza", creteDate: "21", like: 22, dislike: 5 } },
        { type: "Police", position: [2.3622, 45.8566], info: { status: "Available", user: "abdoul", creteDate: "200", like: 22, dislike: 5 } }
    ]);

    const token = Cookies.get("authToken");
    const [userRole, setRole] = useState<string | string[] | null>(null);
    const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
    const [createdMarkers, setCreatedMarkers] = useState<tt.Marker[]>([]);
    const [currentZoom, setCurrentZoom] = useState<number>(0);

    // Fonction pour mettre à jour la visibilité des marqueurs en fonction du zoom
    const updateMarkersVisibility = (zoom: any) => {
        console.log(zoom , "zz")
        createdMarkers.forEach(marker => {
            if (zoom >= 12) {
                marker.getElement().style.display = 'block';
            } else {
                marker.getElement().style.display = 'none';
            }
        });
    };

    const createMarkers = () => {
        if (!map) return;

        // Supprimer les marqueurs existants d'abord
        createdMarkers.forEach(marker => marker.remove());

        const markers: tt.Marker[] = [];

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

            marker.getElement().addEventListener("click", () => {
                setSelectedSignal(signal);
            });

            markers.push(marker);
        });

        setCreatedMarkers(markers);

        // Appliquer la visibilité initiale en fonction du zoom actuel
        const currentZoom = map.getZoom();
        updateMarkersVisibility(currentZoom);
    };

    const handleZoomChange = () => {
        if (!map) return;

        const zoom = map.getZoom();
        console.log(zoom)
        setCurrentZoom(zoom);
        updateMarkersVisibility(currentZoom);
    };

    useEffect(() => {
        setRole(getUserRole());

        if (!map) return;

        // Obtenir le zoom initial
        const initialZoom = map.getZoom();
        setCurrentZoom(initialZoom);

        // Créer les marqueurs
        createMarkers();

        // Ajouter l'écouteur d'événement zoom
        map.on('zoom', handleZoomChange);

        // Nettoyage lors du démontage du composant
        return () => {
            createdMarkers.forEach(marker => marker.remove());
            map.off('zoom', handleZoomChange);
        };
    }, [map, signals, token]);

    useEffect(() => {
        if (map) {
            createMarkers();
        }
    }, [signals]);

    return (
        <>
            <Alert className="w-20" open={!!selectedSignal} onClose={() => setSelectedSignal(null)}>
                {selectedSignal && (
                    <div className="rounded-lg">
                        <div style={{width: "100%", display: "flex", justifyContent: "flex-end"}} className="cursor-pointer flex item-end">
                            <IoMdClose onClick={() => setSelectedSignal(null)} />
                        </div>
                        <PopupContent
                            type={selectedSignal.type}
                            user={selectedSignal.info.user}
                            creteDate={selectedSignal.info.creteDate}
                            like={selectedSignal.info.like}
                            dislike={selectedSignal.info.dislike}
                        />
                    </div>
                )}
            </Alert>
            {userRole &&
                <button
                    style={{zIndex: "1001"}}
                    className="fixed bottom-10 right-10 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600"
                >
                    +
                </button>
            }
        </>
    );
};

export default Markers;