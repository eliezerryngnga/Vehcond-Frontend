import { useQuery } from '@tanstack/react-query';
import { request } from '../components/utils/request';

const fetchApprovedVehicleDates = () => {
    return request ({
        url: "/dates/approved",
        method: "get"
    });
};

export const useFetchApprovedVehicleDates = () => {
    return useQuery ({
        queryKey: ["fetch-approved-vehicle-dates"],
        queryFn: fetchApprovedVehicleDates,
    });
};

const fetchCondemVehicleDates = () => {
    return request ({
        url: "/dates/approved",
        method: "get"
    });
};

export const useFetchCondemVehicleDates = () => {
    return useQuery ({
        queryKey: ["fetch-condem-vehicle-dates"],
        queryFn: fetchCondemVehicleDates,
    });
};

const fetchCirculatedVehicleDates = () => {
    return request ({
        url: "/dates/approved",
        method: "get"
    });
};

export const useFetchCirculatedVehicleDates = () => {
    return useQuery ({
        queryKey: ["fetch-ciruclated-vehicle-dates"],
        queryFn: fetchCirculatedVehicleDates,
    });
};

const fetchAllottedVehicleDates = () => {
    return request ({
        url: "/dates/allotted",
        method: "get"
    });
};

export const useFetchAllottedVehicleDates = () => {
    return useQuery ({
        queryKey: ["fetch-allotted-vehicle-dates"],
        queryFn: fetchAllottedVehicleDates,
    });
};

const fetchTenderedVehicleDates = () => {
    return request ({
        url: "/dates/tendered",
        method: "get"
    });
};

export const useFetchTenderedVehicleDates = () => {
    return useQuery ({
        queryKey: ["fetch-tendered-vehicle-dates"],
        queryFn: fetchTenderedVehicleDates,
    });
};

const fetchLiftedVehicleDates = () => {
    return request ({
        url: "/dates/lifted",
        method: "get"
    });
};

export const useFetchLiftedVehicleDates = () => {
    return useQuery ({
        queryKey: ["fetch-lifted-vehicle-dates"],
        queryFn: fetchLiftedVehicleDates,
    });
};

const fetchScrapVehicleDates = () => {
    return request ({
        url: "/dates/scrapped",
        method: "get"
    });
};

export const useFetchScrapVehicleDates = () => {
    return useQuery ({
        queryKey: ["fetch-scrapped-vehicle-dates"],
        queryFn: fetchScrapVehicleDates,
    });
};

const fetchNonLiftedVehicleDates = () => {
    return request ({
        url: "/dates/non-lifted",
        method: "get"
    });
};

export const useFetchNonLiftedVehicleDates = () => {
    return useQuery ({
        queryKey: ["fetch-non-lifted-vehicle-dates"],
        queryFn: fetchNonLiftedVehicleDates,
    });
};