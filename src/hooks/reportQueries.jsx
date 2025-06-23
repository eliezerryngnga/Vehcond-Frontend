import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// Vehicles Forwarded To Transport PDF.
const fetchVehicleReport = ({applicationCode, disposition}) => {
    return request ({
        url : `/reports/vehicle-report/${applicationCode}`,
        method : "get",
        params: {disposition},
        responseType: 'blob',
    });
}

export const useGenerateVehicleReport = (options) => {
    return useMutation({
        mutationFn: fetchVehicleReport,
        ...options,
    });
}

// VEHICLE ALLOTTED TO OFFICER PDF
const fetchAllotmentLetter = ({queryKey}) => {

    const [_key, params] = queryKey;
    
    return request ({
        url : `/reports/allotment-letter/${params.applicationCode}`,
        method: "get",
        params : {
            letterNo: params.letterNo,
        },
        responseType : 'blob',
    });
}

export const useFetchAllotmentLetter = (params, options = {}) => {
    return useQuery({
        queryKey: ['fetch-allotment-letter', params],
        queryFn: fetchAllotmentLetter,
        enabled: !!params?.applicationCode && !!params?.letterNo,
        refetchOnWindowFocus: false,
        select: (response) => response.data,
        ...options,
    });
}

// MIS REPORTS

// APPROVED VEHICLES - PDF and Excel.
const fetchApprovedVehiclesReport = async ({ year, month, format = 'pdf' }) => {
  try {
    const response = await request({
      url: "/reports/approved-vehicles-report",
      method: "get",

      params: {
        year,
        month,
        format,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Approved-Vehicles-${year}-${String(month).padStart(2, '0')}.${format}`; 

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }

    return { blob: response.data, filename };

  } catch (error) {
   
    if (error.response && error.response.data instanceof Blob) {
      const errorText = await error.response.data.text();
    
      throw new Error(errorText || "An unknown error occurred while generating the report.");
    }

    throw error;
  }
};

export const useFetchApprovedVehicleReport = () => {
  return useMutation({
    mutationFn: fetchApprovedVehiclesReport,

    onSuccess: ({ blob, filename }) => {
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);

      // Append to the document, click, and then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL to free up memory
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully!");
    },

    onError: (error) => {
      // The error thrown from our fetcher's catch block is caught here.
      console.error("Report generation failed:", error.message);
      toast.error(error.message || "Could not generate the report. Please try again.");
    },
  });
};

// VEHICLES RECOMMENDED FOR CONDEMNATION - PDF and Excel
// const fetchCondemnationVehiclesReport = () => {
//     return request ({
//         url: "/condemnation-vehicles-report",
//         method: "get",
//         responseType: 'blob',
//     });
// }

// export const useFetchCondemnationVehicleReport = () => {
//     return useMutation ({
//         mutationFn : fetchCondemnationVehiclesReport,
//     });
// }

// CIRCULATION LIST - PDF
// const fetchCirculationListReport = () => {
//     return request ({
//         url: "/approved-vehicles-report",
//         method: "get",
//         responseType: 'blob',
//     });
// }

// export const useFetchCirculationListReport = () => {
//     return useMutation ({
//         mutationFn : fetchCirculationListReport,
//     });
// }

// ALLOTTED VEHICLES - PDF
// const fetchAllottedVehiclesReport = () => {
//     return request ({
//         url: "/approved-vehicles-report",
//         method: "get",
//         responseType: 'blob',
//     });
// }

// export const useFetchAllottedVehicleReport = () => {
//     return useMutation ({
//         mutationFn : fetchAllottedVehiclesReport,
//     });
// }

// TENDERED VEHICLES - PDF
// const fetchTenderedVehiclesReport = () => {
//     return request ({
//         url: "/tendered-vehicles-report",
//         method: "get",
//         responseType: 'blob',
//     });
// }

// export const useFetchTenderedVehicleReport = () => {
//     return useMutation ({
//         mutationFn : fetchTenderedVehiclesReport,
//     });
// }

// LIFTED VEHICLES
// const fetchLiftedVehiclesReport = () => {
//     return request ({
//         url: "/lifted-vehicles-report",
//         method: "get",
//         responseType: 'blob',
//     });
// }

// export const useFetchLiftedVehicleReport = () => {
//     return useMutation ({
//         mutationFn : fetchLiftedVehiclesReport,
//     });
// }

// SCRAP VEHICLES
// const fetchScrappedVehiclesReport = () => {
//     return request ({
//         url: "/scrapped-vehicles-report",
//         method: "get",
//         responseType: 'blob',
//     });
// }

// export const useFetchScrappedVehicleReport = () => {
//     return useMutation ({
//         mutationFn : fetchScrappedVehiclesReport,
//     });
// }

// NON LIFTED VEHICLES
// const fetchNonLiftedVehiclesReport = () => {
//     return request ({
//         url: "/non-lifted-vehicles-report",
//         method: "get",
//         responseType: 'blob',
//     });
// }

// export const useFetchNonLiftedVehicleReport = () => {
//     return useMutation ({
//         mutationFn : fetchNonLiftedVehiclesReport,
//     });
// }