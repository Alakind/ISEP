import React, {useEffect, useState} from "react";
import Header from "../components/Header.tsx";

function HeaderContainer() {
  const [currentPage, setCurrentPage] = useState<string>("");

  useEffect(() => {
    const path = window.location.pathname.split("/")[2];
    setCurrentPage(path || "");
  }, []);

  return (
    <Header currentPage={currentPage} urlPrefix={`${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_SUBDOMAIN}`}/>
  );
}

export default HeaderContainer;
