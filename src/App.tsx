import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import GlobalSearch from "./components/GlobalSearch";
import Notification from "./components/Notification";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { ThemeContext, ThemeContextType } from "./contexts/ThemeContext";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function App() {
  const [theme, setTheme] = useState<string>("dark");
  const themeContextValue: ThemeContextType = { theme, setTheme };
  return (
    <ThemeContext.Provider value={themeContextValue}>
      <Header>
        <Sidebar />
        <GlobalSearch />
        <Profile />
        <Notification />
        <ThemeSwitcher />
      </Header>
      <Outlet />
      <Footer />
    </ThemeContext.Provider>
  );
}

export default App;
