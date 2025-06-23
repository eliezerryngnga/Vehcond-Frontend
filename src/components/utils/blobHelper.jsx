
export const downloadFileFromResponse = (response, defaultFilename = 'report.pdf') => {
  // Extract filename from the header
  const contentDisposition = response.headers['content-disposition'];
  let filename = defaultFilename;
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
    if (filenameMatch && filenameMatch.length > 1) {
      filename = filenameMatch[1];
    }
  }

  // The blob is in response.data due to responseType: 'blob'
  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadPDF = (blob, title) => {
  let link = document.createElement("a");
  let url = window.URL.createObjectURL(blob);

  link.href = url;
  link.download = `${title}.pdf`; // Specify the filename for the downloaded file
  // Append the link to the document body
  document.body.appendChild(link);
  // Programmatically click the link to trigger the download
  link.click();

  // Remove the link element from the document
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadPdfUrl = (url, title) => {
  let link = document.createElement("a");
  link.href = url;
  link.download = `${title}.pdf`; // Specify the filename for the downloaded file
  // Append the link to the document body
  document.body.appendChild(link);
  // Programmatically click the link to trigger the download
  link.click();

  // Remove the link element from the document
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
