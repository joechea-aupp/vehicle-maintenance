import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import GlobalSearch from "./components/GlobalSearch";
import Notification from "./components/Notification";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Header>
        <Sidebar />
        <GlobalSearch />
        <Profile />
        <Notification />
      </Header>
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
