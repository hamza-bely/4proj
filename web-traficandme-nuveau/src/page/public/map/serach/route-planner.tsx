"use client";

import React, { useEffect, useState, useRef } from "react";
import "../css/map.css";
import { toast } from "react-toastify";
import Search from "./search-bar";
import { useTranslation } from "react-i18next";
import { LuRabbit, LuArrowLeft, LuSave, LuX, LuChevronDown, LuChevronUp } from "react-icons/lu";
import { TbBarrierBlockOff, TbRoute2 } from "react-icons/tb";
import { MdQrCode2, MdDirectionsCar, MdDirectionsWalk } from "react-icons/md";
import { FaBus } from "react-icons/fa";
import useRouteStore from "../../../../services/store/route-store";
import Cookies from "js-cookie";
import { getUserRole } from "../../../../services/service/token-service";
import { fetchUser } from "../../../../services/service/user-service";
import {RouteOption, RoutePlannerProps, RouteSaveData} from "../model/route-planner-model";
import { Coordinate } from "../model/map";
import { QRCodeSVG } from 'qrcode.react';
import {
    calculateRoutes,
    getAddressFromCoordinates,
    getCoordinatesFromAddress, TransportMode
} from "../../../../services/service/map-servie";

const RoutePlanner: React.FC<RoutePlannerProps> = ({ onRouteCalculated, startAddress: initialStartAddress }) => {
    const [start, setStart] = useState<Coordinate>({ lat: 47.6640, lon: 2.8357 });
    const [end, setEnd] = useState<Coordinate>({ lat: 45.7640, lon: 4.835 });
    const { t } = useTranslation();
    const { createRoute } = useRouteStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
    const [role, setRole] = useState<string | string[] | null>(null);
    const token = Cookies.get("authToken");

    const [showInstructions, setShowInstructions] = useState<boolean>(false);

    const [startAddress, setStartAddress] = useState<string>("");
    const [endAddress, setEndAddress] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [showQRCode, setShowQRCode] = useState<boolean>(false);
    const [qrCodeData, setQrCodeData] = useState<string>("");
    const [transportMode, setTransportMode] = useState<TransportMode>("car");
    const simulationIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (initialStartAddress) {
            setStartAddress(initialStartAddress);

            if (initialStartAddress && initialStartAddress !== "") {
                getCoordinatesFromAddress(initialStartAddress)
                    .then(coords => {
                        if (coords) {
                            setStart(coords);
                        }
                    })
                    .catch(error => console.error(t("error.global"), error));
            }
        }
    }, [initialStartAddress, t]);

    useEffect(() => {
        setRole(getUserRole());
        if (token) fetchUser().catch(console.error);

        return () => {
            if (simulationIntervalRef.current !== null) {
                window.clearInterval(simulationIntervalRef.current);
            }
        };
    }, [token]);

    useEffect(() => {
        if (end && end.lat && end.lon) {
            getAddressFromCoordinates(end.lat, end.lon, t)
                .then(address => setEndAddress(address))
                .catch(error => console.error(t("error.global"), error));
        }
    }, [end, t]);

    useEffect(() => {
        if (selectedRouteId) {
            const selectedRoute = routeOptions.find(route => route.id === selectedRouteId);
            if (selectedRoute && selectedRoute.coordinates && selectedRoute.coordinates.length > 0) {
                const vehiclePosition = {
                    position: [selectedRoute.coordinates[0][0], selectedRoute.coordinates[0][1]],
                    type: transportMode,
                    progress: 0
                };
                const event = new CustomEvent("vehiclePositionUpdate", { detail: vehiclePosition });
                window.dispatchEvent(event);
            }
        }
    }, [selectedRouteId, transportMode, routeOptions]);

    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
    };

    const formatDistance = (meters: number): string => {
        const km = meters / 1000;
        return `${km.toFixed(1)} km`;
    };

    const handleCalculateRoutes = async (): Promise<void> => {
        if (!start || !end) {
            toast.error(t("map.select-points"));
            return;
        }

        onRouteCalculated("[]");

        setIsLoading(true);
        setRouteOptions([]);
        setSelectedRouteId(null);
        setShowInstructions(false);

        try {
            // Use our new service function with translations
            const routeNameTranslations = {
                fastest: t("map.fastest"),
                shortest: t("map.shortest"),
                noTolls: t("map.no-tolls")
            };

            const validRoutes = await calculateRoutes(start, end, transportMode, routeNameTranslations);

            if (validRoutes.length > 0) {
                setRouteOptions(validRoutes);
                setSelectedRouteId(validRoutes[0].id);
                onRouteCalculated(JSON.stringify(validRoutes[0].coordinates)); // Display first route
                setShowResults(true);
            } else {
                toast.error(t("map.no-routes"));
            }
        } catch (error) {
            console.error(t("error.global"), error);
            toast.error(t("error.route-calculation"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRouteSelect = (routeId: string) => {
        const selectedRoute = routeOptions.find((route) => route.id === routeId);
        if (selectedRoute) {
            setSelectedRouteId(routeId);
            onRouteCalculated(JSON.stringify(selectedRoute.coordinates));
            setShowInstructions(false);
        }
    };

    const handleBackToSearch = () => {
        setShowResults(false);
        setShowInstructions(false);
    };

    const handleSaveRoute = async () => {
        if (!selectedRouteId) {
            toast.error(t("map.select-route-save"));
            return;
        }

        setIsSaving(true);
        try {
            const selectedRoute = routeOptions.find(route => route.id === selectedRouteId);
            if (!selectedRoute) {
                toast.error(t("map.route-not-found"));
                return;
            }

            const routeData: RouteSaveData = {
                startLongitude: start.lon.toString(),
                startLatitude: start.lat.toString(),
                endLongitude: end.lon.toString(),
                endLatitude: end.lat.toString(),
                address_start: startAddress,
                address_end: endAddress,
                user: "",
                mode: selectedRoute.type === "fastest" ? t("map.mode-fast") : t("map.mode-short"),
                peage: !selectedRoute.avoidTolls
            };

            await createRoute(routeData);
            toast.success(t("map.route-saved"));
        } catch (error) {
            console.error(t("error.save-route"), error);
            toast.error(t("error.save-route"));
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateQRCode = () => {
        if (!selectedRouteId) {
            toast.error(t("map.select-route-qr"));
            return;
        }

        try {
            const selectedRoute = routeOptions.find((route) => route.id === selectedRouteId);
            if (!selectedRoute) {
                toast.error(t("map.route-not-found"));
                return;
            }

            // Create QR code data
            const qrData = {
                start: {
                    lat: start.lat,
                    lon: start.lon,
                    address: startAddress
                },
                end: {
                    lat: end.lat,
                    lon: end.lon,
                    address: endAddress
                },
                route: {
                    type: selectedRoute.type,
                    avoidTolls: selectedRoute.avoidTolls,
                    distance: selectedRoute.distance,
                    duration: selectedRoute.duration,
                    transportMode: transportMode
                }
            };

            // Convert data to JSON string
            const qrCodeDataStr = JSON.stringify(qrData);
            setQrCodeData(qrCodeDataStr);

            // Show modal
            setShowQRCode(true);
        } catch (error) {
            console.error(t("error.qr-generation"), error);
            toast.error(t("error.qr-generation"));
        }
    };

    const handleCloseQRModal = () => {
        setShowQRCode(false);
    };

    const handleTransportModeChange = (mode: TransportMode) => {
        setTransportMode(mode);
        if (start && end && showResults) {
            handleCalculateRoutes();
        }
    };

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    const getTransportModeText = (mode: TransportMode): string => {
        switch (mode) {
            case "car": return t("map.transport.car");
            case "bike": return t("map.transport.bike");
            case "bus": return t("map.transport.bus");
            case "walk": return t("map.transport.walk");
            default: return t("map.transport.car");
        }
    };

    const renderTransportModeSelector = () => (
        <div className="flex justify-center mb-4 p-2 rounded">
            <button
                onClick={() => handleTransportModeChange("car")}
                className={`mx-2 p-2 rounded ${transportMode === "car" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                title={t("map.transport.car")}
            >
                <MdDirectionsCar size={24}/>
            </button>
            <button
                onClick={() => handleTransportModeChange("bus")}
                className={`mx-2 p-2 rounded ${transportMode === "bus" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                title={t("map.transport.bus")}
            >
                <FaBus size={24}/>
            </button>
            <button
                onClick={() => handleTransportModeChange("walk")}
                className={`mx-2 p-2 rounded ${transportMode === "walk" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                title={t("map.transport.walk")}
            >
                <MdDirectionsWalk size={24}/>
            </button>
        </div>
    );

    const renderDrivingInstructions = () => {
        if (!selectedRouteId) return null;
        const selectedRoute = routeOptions.find(route => route.id === selectedRouteId);
        if (!selectedRoute || !selectedRoute.instructions || selectedRoute.instructions.length === 0) {
            return <div className="text-center text-gray-500 py-2">{t("map.no-instructions")}</div>;
        }

        return (
            <div className="mt-4 border-t pt-4">
                <div
                    className="flex justify-between items-center cursor-pointer font-medium text-blue-600"
                    onClick={toggleInstructions}
                >
                    <span>{t("map.driving-instructions")}</span>
                    {showInstructions ?
                        <LuChevronUp className="text-lg" /> :
                        <LuChevronDown className="text-lg" />
                    }
                </div>

                {showInstructions && (
                    <div className="mt-2 max-h-64 overflow-y-auto">
                        <ol className="list-decimal list-inside text-sm space-y-2 pl-2">
                            {selectedRoute.instructions.map((instruction, index) => (
                                <li key={index} className="border-b pb-2">
                                    <span className="font-medium">{instruction.message}</span>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {instruction.distance > 0 && (
                                            <span className="mr-2">{formatDistance(instruction.distance)}</span>
                                        )}
                                        {instruction.duration > 0 && (
                                            <span>{formatDuration(instruction.duration)}</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="relative">
            <h2 className="flex items-center">
                {showResults && (
                    <button
                        onClick={handleBackToSearch}
                        className="mr-2 p-1 rounded-full hover:bg-gray-200"
                        aria-label={t("map.back-to-search")}
                    >
                        <LuArrowLeft className="text-xl" />
                    </button>
                )}
                {showResults ?
                    (showInstructions ? t("map.driving-instructions") : t("map.available-routes"))
                    : t("map.route-planner")}
            </h2>

            {!showResults && renderTransportModeSelector()}

            {!showResults ? (
                <>
                    <div className="relative mb-4 flex">
                        <Search
                            initialValue={startAddress}
                            onSearchResultSelect={(position: Coordinate, address?: string) => {
                                setStart(position);
                                if (address) setStartAddress(address);
                            }}
                        />
                    </div>
                    <Search
                        onSearchResultSelect={(position: Coordinate, address?: string) => {
                            setEnd(position);
                            if (address) setEndAddress(address);
                        }}
                    />

                    <div className="flex justify-center">
                        <button
                            style={{backgroundColor: "#5DB3FF"}}
                            className="rounded-sm m-2 flex px-2 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                            onClick={handleCalculateRoutes}
                            disabled={isLoading}
                        >
                            {isLoading ? t("map.calculating") : t("map.calculate-routes")}
                        </button>
                    </div>
                </>
            ) : (
                <div className="route-options">
                    {/* Show route options only when instructions are not displayed */}
                    {!showInstructions && (
                        <div className="space-y-2">
                            {routeOptions.map((route) => (
                                <div
                                    key={route.id}
                                    className={`route-item p-3 border rounded cursor-pointer hover:bg-gray-100 ${selectedRouteId === route.id ? 'bg-blue-50 border-blue-300' : ''}`}
                                    onClick={() => handleRouteSelect(route.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {route.type === "fastest" ? (
                                                <LuRabbit className="text-xl mr-2" />
                                            ) : (
                                                <TbRoute2 className="text-xl mr-2" />
                                            )}
                                            <span className="font-medium">{route.name}</span>
                                        </div>
                                        {route.avoidTolls && (
                                            <TbBarrierBlockOff className="text-lg ml-2" />
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        <span>{formatDistance(route.distance)}</span>
                                        <span className="mx-2">•</span>
                                        <span>{formatDuration(route.duration)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Always render the driving instructions toggle if a route is selected */}
                    {selectedRouteId && !showInstructions && renderDrivingInstructions()}

                    {/* When instructions are showing, display the full instructions list */}
                    {showInstructions && selectedRouteId && (
                        <div className="mt-2">
                            <div className="flex justify-between items-center mb-4">
                                <button
                                    onClick={toggleInstructions}
                                    className="flex items-center text-blue-600 hover:text-blue-800"
                                >
                                    <LuArrowLeft className="mr-1" /> {t("map.back-to-routes")}
                                </button>

                                <div className="text-sm text-gray-600">
                                    {(() => {
                                        const selectedRoute = routeOptions.find(route => route.id === selectedRouteId);
                                        if (selectedRoute) {
                                            return (
                                                <>
                                                    <span>{formatDistance(selectedRoute.distance)}</span>
                                                    <span className="mx-1">•</span>
                                                    <span>{formatDuration(selectedRoute.duration)}</span>
                                                </>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border p-4 max-h-96 overflow-y-auto">
                                <ol className="list-decimal list-inside text-sm space-y-3 pl-2">
                                    {(() => {
                                        const selectedRoute = routeOptions.find((route) => route.id === selectedRouteId);
                                        if (selectedRoute && selectedRoute.instructions) {
                                            return selectedRoute.instructions.map((instruction, index) => (
                                                <li key={index} className="border-b pb-3">
                                                    <span className="font-medium">{instruction.message}</span>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {instruction.distance > 0 && (
                                                            <span className="mr-2">{formatDistance(instruction.distance)}</span>
                                                        )}
                                                        {instruction.duration > 0 && (
                                                            <span>{formatDuration(instruction.duration)}</span>
                                                        )}
                                                    </div>
                                                </li>
                                            ));
                                        }
                                        return <li>{t("map.no-instructions")}</li>;
                                    })()}
                                </ol>
                            </div>
                        </div>
                    )}

                    {role && !showInstructions && <div className="flex justify-center mt-4 space-x-2">
                        <button
                            onClick={handleSaveRoute}
                            disabled={isSaving || !selectedRouteId}
                            className="rounded-sm px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 flex items-center"
                        >
                            <LuSave className="mr-2" />
                            {isSaving ? t("map.saving") : t("map.save-route")}
                        </button>

                        <button
                            onClick={handleGenerateQRCode}
                            disabled={!selectedRouteId}
                            className="rounded-sm px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex items-center"
                        >
                            <MdQrCode2 className="mr-2" />
                            {t("map.qr-code")}
                        </button>
                    </div>}
                </div>
            )}

            {showQRCode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">{t("map.scan-qr")}</h3>
                            <button
                                onClick={handleCloseQRModal}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label={t("common.close")}
                            >
                                <LuX size={24} />
                            </button>
                        </div>

                        <div className="flex justify-center mb-4">
                            <QRCodeSVG
                                value={qrCodeData}
                                size={250}
                                level="M"
                                includeMargin={true}
                            />
                        </div>

                        <div className="text-center text-sm text-gray-500 mb-4">
                            <p>{t("map.qr-contains")}</p>
                            <p>{t("map.from")}: {startAddress}</p>
                            <p>{t("map.to")}: {endAddress}</p>
                            <p>{t("map.transport-mode")}: {getTransportModeText(transportMode)}</p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleCloseQRModal}
                                className="rounded-sm px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
                            >
                                {t('common.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoutePlanner;