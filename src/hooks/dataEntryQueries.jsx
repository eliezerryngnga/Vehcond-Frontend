import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

//Get: District Name
const fetchDristrictName = () => {
    return request({
        url: `/districts`,
        method: "get",
    })
};

export const useFetchDistrictName = () => {
    return useQuery({
        queryKey: ["fetch-district-name"],
        queryFn: fetchDristrictName,
    });
};

//Get: District RTO
const fetchDristrictRto = () => 
{
    return request ({
        url: `/district-rto`,
        method: "get",
    })
};

export const useFetchDistrictRto = () => {
    
    return useQuery ({
        queryKey:[ "fetch-district-rto"],
        queryFn : fetchDristrictRto,
    })
};

// GET: Financial Year
const fetchFinancialYear = () => 
    {
        return request ({
            url: `/financial-year`,
            method: "get",
        })
    };
    
    export const useFetchFinancialYear = () => {
        
        return useQuery ({
            queryKey:[ "fetch-financial-year"],
            queryFn : fetchFinancialYear,
        })
    };


//Get: Department
const fetchDepartment = () =>
{
    return request ({
        url: `/department`,
        method: "get"
    })
}

export const useFetchDepartment = () =>
{
    return useQuery ({
        queryKey: ["fetch-department"],
        queryFn: fetchDepartment,
    })
}

//Get: Vehicle Type
const fetchVehicleType = () =>
{
    return request ({
        url:`/vehicle-type`,
        method: "get"
    })
}

export const useFetchVehicleType = () =>
{
    return useQuery ({
        queryKey: ["fetch-vehicle-type"],
        queryFn: fetchVehicleType,
    })

}

//Get: Vehicle Manufacturers
const fetchVehicleManufacturers = () =>
{
    return request ({
        url: `/vehicle-manufacturer`,
        method: "get",
    })
}

export const useFetchVehicleManufacturer = () =>
{
    return useQuery ({
        queryKey: ["fetch-vehicle-manufacturer"],
        queryFn: fetchVehicleManufacturers,
    })
}

//Get: Vehicle Parts 
const fetchVehicleParts = () =>
{
    return request ({
        url: `/vehicle-parts`,
        method: "get", 
    })
}

export const useFetchVehicleParts = () =>
{
    return useQuery ({
        queryKey: ["fetch-vehicle-parts"],
        queryFn: fetchVehicleParts,
    })
}

//POST
const draft = (data) => {
    return request ({
        url: `/draft`,
        method: "post",
        data: data,
    })
}

export const useSendToDraft = () => {
    return useMutation ({
        mutationFn: draft,
        onSuccess: (data, variables, context) => {
            console.log("Data sent to draft successfully: ", data);
        },
        onError: (error, variables, context) => {
            console.log("Error sending data to draft: ", error);
        },
    });
};

