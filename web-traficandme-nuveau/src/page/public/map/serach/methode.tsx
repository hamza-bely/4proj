import {toast} from "react-toastify";

export async function getAddressFromCoordinates(latitude: number, longitude: number,t: any): Promise<string> {
    const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
    const url = `https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?key=${apiKey}&language=fr-FR`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.addresses && data.addresses.length > 0) {
            const address = data.addresses[0].address;
            const formattedAddress = [
                address.streetNumber,
                address.streetName,
                address.municipalitySubdivision,
                address.municipality,
                address.postalCode,
                address.countrySubdivision
            ].filter(Boolean).join(", ");

            return formattedAddress;
        }
        return "Adresse inconnue";
    } catch (error) {
        toast.error(t("error-global"));
        return "Erreur lors de la récupération de l'adresse";
    }
}
