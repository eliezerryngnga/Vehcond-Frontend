import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

const fetchDristrictName = () => {
    return request({
        url: `/districts`,
        method: "get",
    })
};

export const useFetchDistrictName = () => {
    return useQuery({
        queryKey: ["fetch-district-name"],
        queryFn: () => fetchDristrictName(),
    });
};