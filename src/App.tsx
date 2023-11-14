import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import GlobalSearch from "./components/GlobalSearch";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Header>
        <Sidebar />
        <GlobalSearch />
      </Header>
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
