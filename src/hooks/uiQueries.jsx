import { useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Menu Links
const fetchMenuLinks = () => {
  return request({
    url: `/menu?roleCode=${rolecode}`,
    method: "get",
  });
};

export const useFetchMenuLinks = (rolecode) => {
  return useQuery({
    queryKey: ["fetch-menu-links", rolecode],
    queryFn: () => fetchMenuLinks(rolecode),
  });
};
