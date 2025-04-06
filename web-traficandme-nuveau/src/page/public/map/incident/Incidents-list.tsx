import React from "react";
import "./incidents.css";

interface Incident {
    geometry: {
        coordinates: number[];
    };
    properties: {
        eventText: string;
        severity: string;
        iconCategory: string;
        startTime: string;
        endTime?: string;
    };
}

interface IncidentsListProps {
    incidents: Incident[];
    onIncidentClick: (incident: Incident) => void;
}

const IncidentsList: React.FC<IncidentsListProps> = ({ incidents, onIncidentClick }) => {
    // Fonction pour formater l'heure
    const formatTime = (timeString: string) => {
        return new Date(timeString).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Fonction pour obtenir la classe CSS basée sur la sévérité
    const getSeverityClass = (severity: string) => {
        switch (severity) {
            case "major": return "severity-major";
            case "moderate": return "severity-moderate";
            case "minor": return "severity-minor";
            default: return "severity-unknown";
        }
    };

    // Fonction pour obtenir une icône basée sur la catégorie
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "accident": return "🚗";
            case "congestion": return "🚦";
            case "construction": return "🚧";
            case "weatherCondition": return "🌧️";
            default: return "ℹ️";
        }
    };

    return (
        <div className="incidents-panel">
            <h3>Incidents de trafic ({incidents.length})</h3>

            {incidents.length === 0 ? (
                <p className="no-incidents">Aucun incident à afficher</p>
            ) : (
                <div className="incidents-list">
                    {incidents.map((incident, index) => (
                        <div
                            key={index}
                            className={`incident-item ${getSeverityClass(incident.properties.severity)}`}
                            onClick={() => onIncidentClick(incident)}
                        >
                            <div className="incident-icon">
                                {getCategoryIcon(incident.properties.iconCategory)}
                            </div>
                            <div className="incident-details">
                                <p className="incident-text">{incident.properties.eventText}</p>
                                <div className="incident-meta">
                  <span className="incident-time">
                    {formatTime(incident.properties.startTime)}
                  </span>
                                    <span className="incident-category">
                    {incident.properties.iconCategory}
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default IncidentsList;