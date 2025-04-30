"use client";

import React, { useEffect, useState, useRef } from "react";
import "../css/map.css";
import { toast } from "react-toastify";
import Search from "./search-bar";
import { useTranslation } from "react-i18next";
import { LuRabbit, LuArrowLeft, LuSave, LuX, LuChevronDown, LuChevronUp } from "react-icons/lu";
import { TbBarrierBlockOff, TbRoute2 } from "react-icons/tb";
import { MdQrCode2, MdDirectionsCar, MdDirectionsWalk } from "react-icons/md";
import { FaBus, FaGasPump } from "react-icons/fa";
import { PiEngineBold } from "react-icons/pi";
import { RiEBike2Line } from "react-icons/ri";
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

// Fuel type constants
type FuelType = "electric" | "gasoline" | "diesel";

// Constants for consumption calculations
const CONSUMPTION_RATES = {
    electric: 18, // kWh per 100km
    gasoline: 7, // liters per 100km
    diesel: 6, // liters per 100km
};

const FUEL_PRICES = {
    electric: 0.20, // € per kWh
    gasoline: 1.85, // € per liter
    diesel: 1.75, // € per liter
};

// Average toll rate per km for highways in France (estimated)
const TOLL_RATE_PER_KM = 0.12; // € per km

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
    const [showCostDetails, setShowCostDetails] = useState<boolean>(false);

    const [startAddress, setStartAddress] = useState<string>("");
    const [endAddress, setEndAddress] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [showQRCode, setShowQRCode] = useState<boolean>(false);
    const [qrCodeData, setQrCodeData] = useState<string>("");
    const [transportMode, setTransportMode] = useState<TransportMode>("car");
    const [fuelType, setFuelType] = useState<FuelType>("gasoline");
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

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    // Calculate fuel consumption for a given distance in meters
    const calculateFuelConsumption = (distanceMeters: number, fuelType: FuelType): { consumption: number; cost: number } => {
        const distanceKm = distanceMeters / 1000;

        // Calculate consumption based on fuel type
        const consumption = (distanceKm * CONSUMPTION_RATES[fuelType]) / 100;

        // Calculate cost
        const cost = consumption * FUEL_PRICES[fuelType];

        return { consumption, cost };
    };

    // Calculate toll cost for a route
    const calculateTollCost = (distanceMeters: number, avoidTolls: boolean): number => {
        if (avoidTolls) return 0;

        // Estimate highway distance as a percentage of total distance
        // For routes with tolls, assume 80% is on highways with tolls
        const highwayDistanceKm = (distanceMeters / 1000) * 0.8;
        return highwayDistanceKm * TOLL_RATE_PER_KM;
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
        setShowCostDetails(false);

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
            setShowCostDetails(false);
        }
    };

    const handleBackToSearch = () => {
        setShowResults(false);
        setShowInstructions(false);
        setShowCostDetails(false);
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

            const address_start = await getAddressFromCoordinates(start.lat, start.lon,t)

            const routeData: RouteSaveData = {
                startLongitude: start.lon.toString(),
                startLatitude: start.lat.toString(),
                endLongitude: end.lon.toString(),
                endLatitude: end.lat.toString(),
                address_start: address_start,
                address_end: endAddress,
                user: "",
                mode: selectedRoute.type === "fastest" ? t("Rapide") : t("Court"),
                peage: !selectedRoute.avoidTolls
            };
            console.log(routeData)

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

            // Calculate fuel and toll costs
            const { consumption, cost: fuelCost } = calculateFuelConsumption(selectedRoute.distance, fuelType);
            const tollCost = calculateTollCost(selectedRoute.distance, selectedRoute.avoidTolls);

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
                    transportMode: transportMode,
                    fuelType: fuelType,
                    fuelConsumption: consumption,
                    fuelCost: fuelCost,
                    tollCost: tollCost
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

    const handleFuelTypeChange = (type: FuelType) => {
        setFuelType(type);
        // No need to recalculate routes, just update the cost information
    };

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
        setShowCostDetails(false);
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

    const renderFuelTypeSelector = () => (
        <div className="mt-4 mb-4">
            <h3 className="text-sm font-medium mb-2">{t("map.select-fuel-type")}</h3>
            <div className="flex justify-center p-2 rounded bg-gray-50">
                <button
                    onClick={() => handleFuelTypeChange("electric")}
                    className={`mx-2 p-2 rounded ${fuelType === "electric" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                    title={t("map.fuel.electric")}
                >
                    <RiEBike2Line size={20}/>
                    <span className="text-xs block mt-1">{t("map.fuel.electric")}</span>
                </button>
                <button
                    onClick={() => handleFuelTypeChange("gasoline")}
                    className={`mx-2 p-2 rounded ${fuelType === "gasoline" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                    title={t("map.fuel.gasoline")}
                >
                    <FaGasPump size={20}/>
                    <span className="text-xs block mt-1">{t("map.fuel.gasoline")}</span>
                </button>
                <button
                    onClick={() => handleFuelTypeChange("diesel")}
                    className={`mx-2 p-2 rounded ${fuelType === "diesel" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                    title={t("map.fuel.diesel")}
                >
                    <PiEngineBold size={20}/>
                    <span className="text-xs block mt-1">{t("map.fuel.diesel")}</span>
                </button>
            </div>
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
                    (showInstructions ? t("map.driving-instructions") :
                        showCostDetails ? t("map.cost-details") : t("map.available-routes"))
                    : t("map.route-planner")}
            </h2>

            {!showResults && renderTransportModeSelector()}
            {!showResults && transportMode === "car" && renderFuelTypeSelector()}

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
                    {/* Show route options only when instructions and cost details are not displayed */}
                    {!showInstructions && !showCostDetails && (
                        <div className="space-y-2">
                            {routeOptions.map((route) => {
                                const { cost: fuelCost } = calculateFuelConsumption(route.distance, fuelType);
                                const tollCost = calculateTollCost(route.distance, route.avoidTolls);
                                const totalCost = fuelCost + tollCost;

                                return (
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
                                            <div className="flex items-center">
                                                {route.avoidTolls && (
                                                    <TbBarrierBlockOff className="text-lg ml-2" title={t("map.no-tolls")} />
                                                )}
                                                <span className="ml-2 text-sm font-medium" title={t("map.total-cost")}>
                                                    {formatCurrency(totalCost)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            <span>{formatDistance(route.distance)}</span>
                                            <span className="mx-2">•</span>
                                            <span>{formatDuration(route.duration)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {selectedRouteId && !showInstructions && renderDrivingInstructions()}

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
                                    })()}
                                </ol>
                            </div>
                        </div>
                    )}



                    {selectedRouteId && !showInstructions && !showCostDetails && (
                        <div className="mt-6 flex justify-center gap-4">
                            {role && (
                                <button
                                    onClick={handleSaveRoute}
                                    disabled={isSaving}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    <LuSave className="mr-2" />
                                    {isSaving ? t("map.saving") : t("map.save-route")}
                                </button>
                            )}
                            <button
                                onClick={handleGenerateQRCode}
                                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                            >
                                <MdQrCode2 className="mr-2" />
                                {t("map.generate-qr")}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* QR Code Modal */}
            {showQRCode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-medium">{t("map.route-qr-code")}</h3>
                            <button
                                onClick={handleCloseQRModal}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <LuX size={24} />
                            </button>
                        </div>
                        <div className="flex justify-center p-4 bg-white rounded-lg">
                            <QRCodeSVG
                                value={qrCodeData}
                                size={250}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                        <p className="text-sm text-center mt-4 text-gray-600">
                            {t("map.scan-qr-code")}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoutePlanner;