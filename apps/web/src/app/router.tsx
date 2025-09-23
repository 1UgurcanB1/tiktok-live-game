import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import GameSelect from "../pages/GameSelect";
import Rules from "../pages/Rules";
import Play from "../pages/Play";
import RoundSummary from "../pages/RoundSummary";
import Scoreboard from "../pages/Scoreboard";
import Support from "../pages/Support";
import ControlHome from "../pages/control/ControlHome";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/select", element: <GameSelect /> },
  { path: "/rules", element: <Rules /> },
  { path: "/play", element: <Play /> },
  { path: "/summary", element: <RoundSummary /> },
  { path: "/scoreboard", element: <Scoreboard /> },
  { path: "/support", element: <Support /> },
  { path: "/control", element: <ControlHome /> },
]);
