import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import FondiInterprofessionali from "./pages/FondiInterprofessionali";
import Europrogettazione from "./pages/Europrogettazione";
import QualificheRegolamentate from "./pages/QualificheRegolamentate";
import FinanzaAgevolata from "./pages/FinanzaAgevolata";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/servizi/fondi-interprofessionali"} component={FondiInterprofessionali} />
      <Route path={"/servizi/europrogettazione"} component={Europrogettazione} />
      <Route path={"/servizi/qualifiche-regolamentate"} component={QualificheRegolamentate} />
      <Route path={"/servizi/finanza-agevolata"} component={FinanzaAgevolata} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
