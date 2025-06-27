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
const fetchApprovedVehiclesReportPDF = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/approved-vehicles-report/pdf",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Approved-Vehicles-${year}-${String(month).padStart(2, '0')}`; 

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

export const useFetchApprovedVehicleReportPDF = () => {
  return useMutation({
    mutationFn: fetchApprovedVehiclesReportPDF,

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

const fetchApprovedVehiclesReportExcel = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/approved-vehicles/xlsx",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Approved-Vehicles-${year}.xlsx`; 

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

export const useFetchApprovedVehicleReportExcel = () => {
  return useMutation({
    mutationFn: fetchApprovedVehiclesReportExcel,

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
const fetchCondemnedVehiclesReportPDF = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/condemn-vehicles-report/pdf",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Condemned-Vehicles-${year}-${String(month).padStart(2, '0')}`; 

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

export const useFetchCondemnedVehicleReportPDF = () => {
  return useMutation({
    mutationFn: fetchCondemnedVehiclesReportPDF,

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

const fetchCondemnedVehiclesReportExcel = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/condemn-vehicles-report/xlsx",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Condemned-Vehicles-${year}.xlsx`; 

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

export const useFetchCondemnedVehicleReportExcel = () => {
  return useMutation({
    mutationFn: fetchCondemnedVehiclesReportExcel,

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

// CIRCULATION LIST - PDF
const fetchCirculationReportPDF = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/circulated-vehicles-report/pdf",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Circulated-Vehicles-${year}-${String(month).padStart(2, '0')}`; 

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

export const useFetchCirculationReportPDF = () => {
  return useMutation({
    mutationFn: fetchCirculationReportPDF,

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

const fetchCirculationReportExcel = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/circulated-vehicles-report/xlsx",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Circulated-Vehicles-${year}.xlsx`; 

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

export const useFetchCirculationReportExcel = () => {
  return useMutation({
    mutationFn: fetchCirculationReportExcel,

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
// ALLOTTED VEHICLES - PDF
const fetchAllottedReportPDF = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/allotted-vehicles-report/pdf",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Allotted-Vehicles-${year}-${String(month).padStart(2, '0')}`; 

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

export const useFetchAllottedReportPDF = () => {
  return useMutation({
    mutationFn: fetchAllottedReportPDF,

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

const fetchAllottedReportExcel = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/allotted-vehicles-report/xlsx",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Allotted-Vehicles-${year}.xlsx`; 

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

export const useFetchAllottedReportExcel = () => {
  return useMutation({
    mutationFn: fetchAllottedReportExcel,

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

// TENDERED VEHICLES - PDF
const fetchTenderedReportPDF = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/tendered-vehicles-report/pdf",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Tendered-Vehicles-${year}-${String(month).padStart(2, '0')}`; 

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

export const useFetchTenderedReportPDF = () => {
  return useMutation({
    mutationFn: fetchTenderedReportPDF,

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

const fetchTenderedReportExcel = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/tendered-vehicles-report/xlsx",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Tendered-Vehicles-${year}.xlsx`; 

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

export const useFetchTenderedReportExcel = () => {
  return useMutation({
    mutationFn: fetchTenderedReportExcel,

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

// LIFTED VEHICLES
const fetchLiftedReportPDF = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/lifted-vehicles-report/pdf",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Lifted-Vehicles-${year}-${String(month).padStart(2, '0')}`; 

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

export const useFetchLiftedReportPDF = () => {
  return useMutation({
    mutationFn: fetchLiftedReportPDF,

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

const fetchLiftedReportExcel = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/lifted-vehicles-report/xlsx",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Lifted-Vehicles-${year}.xlsx`; 

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

export const useFetchLiftedReportExcel = () => {
  return useMutation({
    mutationFn: fetchLiftedReportExcel,

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

// SCRAP VEHICLES
const fetchScrappedReportPDF = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/scrapped-vehicles-report/pdf",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Scrapped-Vehicles-${year}-${String(month).padStart(2, '0')}`; 

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

export const useFetchScrappedReportPDF = () => {
  return useMutation({
    mutationFn: fetchScrappedReportPDF,

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

const fetchScrappedReportExcel = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/scrapped-vehicles-report/xlsx",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Scrapped-Vehicles-${year}.xlsx`; 

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

export const useFetchScrappedReportExcel = () => {
  return useMutation({
    mutationFn: fetchScrappedReportExcel,

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

// NON LIFTED VEHICLES
const fetchNonLiftedReportPDF = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/non-lifted-vehicles-report/pdf",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Non-Lifted-Vehicles-${year}-${String(month).padStart(2, '0')}`; 

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

export const useFetchNonLiftedReportPDF = () => {
  return useMutation({
    mutationFn: fetchNonLiftedReportPDF,

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

const fetchNonLiftedReportExcel = async ({ year, month }) => {
  try {
    const response = await request({
      url: "/reports/non-lifted-vehicles-report/xlsx",
      method: "get",

      params: {
        year,
        month,
      },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Non-Lifted-Vehicles-${year}.xlsx`; 

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

export const useFetchNonLiftedReportExcel = () => {
  return useMutation({
    mutationFn: fetchNonLiftedReportExcel,

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