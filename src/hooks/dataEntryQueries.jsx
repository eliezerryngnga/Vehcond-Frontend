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

//GET : For Select Field
const fetchDepartmentForSelect = () =>
{
    return request ({
        url: `/department/all-for-selection`,
        method: "get"
    })
}

export const useFetchDepartmentForSelect = () =>
{
    return useQuery ({
        queryKey: ["fetch-department-for-select"],
        queryFn: fetchDepartmentForSelect,
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
        url: "/draft",
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

//POST
const final = (data) => {
    return request ({
        url: "/final-submit",
        method: "post",
        data: data,
    })
}

export const useSendToFinal = () => {
    return useMutation ({
        mutationFn: final,
        onSuccess: (data, variables, context) => {
            console.log("Data sent to draft successfully: ", data);
        },
        onError: (error, variables, context) => {
            console.log("Error sending data to draft: ", error);
        },
    });
};

//GET : List of Draft Vehicle
const fetchListDrafts = ({ queryKey }) => {
    const [_key, page = 0, size = 10, search = ''] = queryKey;
    
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    if(search)
    {
        params.append('search', search);
    }

    return request({
        url: `/draft/list?${params.toString()}`,
        method: "get",
    })
}

export const useFetchListDrafts = (pageNumber, pageSize, searchTerm) => {
    return useQuery({
        queryKey: ["fetch-list-drafts", pageNumber, pageSize, searchTerm],
        queryFn: fetchListDrafts,
        keepPreviousData: true,
    })
}

// GET : LIST of Rejected Vehicle
const fetchRejectList = ({ queryKey }) => {
    const [_key, page = 0, size = 10, search = ''] = queryKey;
    
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    if(search)
    {
        params.append('search', search);
    }

    return request({
        url: `/draft/reject-list?${params.toString()}`,
        method: "get",
    })
}

export const useFetchRejectedList = (pageNumber, pageSize, searchTerm) => {
    return useQuery({
        queryKey: ["fetch-reject-list", pageNumber, pageSize, searchTerm],
        queryFn: fetchRejectList,
        keepPreviousData: true,
    })
}


// GET : List of Final submitted Vehicles
const fetchListFinals = ({ queryKey }) => {
    const [_key, page = 0, size = 10, search = ''] = queryKey;
    
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    if(search)
    {
        params.append('search', search);
    }

    return request({
        url: `/final-submit/list?${params.toString()}`,
        method: "get",
    })
}

export const useFetchListFinals = (pageNumber, pageSize, searchTerm) => {
    return useQuery({
        queryKey: ["fetch-list-finals", pageNumber, pageSize, searchTerm],
        queryFn: fetchListFinals,
        keepPreviousData: true,
    })
}



// GET : Vehicles TO BE LIFTED
const fetchVehiclesToLift = ({queryKey}) => {
    const [_key, page = 0, size = 10, search = ''] = queryKey;
    
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    if(search)
    {
        params.append('search', search);
    }

    return request ({
        url: `/transport-lifting/allotted-list?${params.toString()}`,
        method: "get",
    })
}

export const useFetcVehiclesToLift = (pageNumber, pageSize, searchTerm) => {
    return useQuery ({
        queryKey: ["fetch-vehicles-to-lift", pageNumber, pageSize, searchTerm],
        queryFn: fetchVehiclesToLift,
        keepPreviousData: true,
    })   
}


//Get: PageUrl
const fetchPageUrl = () =>
{
    return request ({
        url:"/pageUrl",
        method: "get"
    })
}

export const useFetchPageUrl = () =>
{
    return useQuery ({
        queryKey: ["fetch-page-url"],
        queryFn: fetchPageUrl,
    })

}



//GET : Fetch a Vehicle For Edit
const fetchDraftByCode = (applicationCode) => {
    return request ({
        url: `/draft/details/${applicationCode}`,
        method : "get",
    })
} 

export const useFetchDraftByCode = (applicationCode) => {
    return useQuery ({
        queryKey: ["fetch-draft-by-code", applicationCode],
        queryFn: () => fetchDraftByCode(applicationCode),
        enabled: !!applicationCode,
    })
}