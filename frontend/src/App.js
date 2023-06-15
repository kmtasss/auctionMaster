import Layout from './components/Layout';
import {Home} from "./pages/Home";
import {Orders} from "./pages/Orders";
import {SignUp} from "./pages/SignUp";
import {SignIn} from "./pages/SignIn";
import RequireAuth from './components/RequireAuth';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import './App.css';
import {useEffect} from "react";
import {useDarkMode} from "./useDarkMode";
import useAuth from "./hooks/useAuth";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "./themes.js";
import {AdminAddProduct} from "./components/AdminAddProduct";
const StyledApp = styled.div`
  color: ${(props) => props.theme.fontColor};
`
function App() {

    const {login, logout}=useAuth()
    const navigate = useNavigate();
    const [ theme, toggleTheme ] = useDarkMode();
    const themeMode = theme === 'light' ? darkTheme : darkTheme;

    useEffect(()=>{

        // const localStorageData=JSON.parse(localStorage.getItem("userData"))
        // login(localStorageData.accessToken,localStorageData.email)
        // localStorageData.accessToken && navigate("/")
    },[])

    return (
        <ThemeProvider theme={themeMode}>
            <StyledApp>
            <GlobalStyles />
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route path="sign-in" element={<SignIn />} />
                <Route path="sign-up" element={<SignUp />} />
                <Route  element={<RequireAuth/>}>
                    <Route index element={<Home />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path='adm-add' element={<AdminAddProduct/>}/>
                </Route>
            </Route>
        </Routes>
            </StyledApp>
            </ThemeProvider>
    );
}

export default App;