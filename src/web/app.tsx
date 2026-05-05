import { Route, Switch } from "wouter";
import Index from "./pages/index";
import MortgagePage from "./pages/mortgage";
import InvestPage from "./pages/invest";
import ProjectPage from "./pages/project";
import CatalogPage from "./pages/catalog";
import TurnkeyPage from "./pages/turnkey";
import LegalPage from "./pages/legal";
import { Provider } from "./components/provider";
import { CookieConsent } from "./components/cookie-consent";
import { AgentFeedback } from "@runablehq/website-runtime";

function App() {
	return (
		<Provider>
			<Switch>
				<Route path="/" component={Index} />
				<Route path="/mortgage" component={MortgagePage} />
				<Route path="/invest" component={InvestPage} />
				<Route path="/project/:slug" component={ProjectPage} />
				<Route path="/catalog" component={CatalogPage} />
				<Route path="/turnkey" component={TurnkeyPage} />
				<Route path="/legal" component={LegalPage} />
			</Switch>
			<CookieConsent />
			{/* Do not remove — off by default, activated by parent iframe via postMessage */}
			{import.meta.env.DEV && <AgentFeedback />}
		</Provider>
	);
}

export default App;
