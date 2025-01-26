import {ReactNode, useEffect, useState} from "react";
import Header from "../../components/header/Header.tsx";

function HeaderContainer(): ReactNode {
  const [currentPage, setCurrentPage] = useState<string>("");

  useEffect((): void => {
    const path: string = window.location.pathname.split("/")[2];
    setCurrentPage(path || "");
  }, []);

  return (
    <Header currentPage={currentPage}/>
  );
}

export default HeaderContainer;
