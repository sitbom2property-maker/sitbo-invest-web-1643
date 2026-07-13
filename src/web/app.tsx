import { Route, Switch } from "wouter";
import Index from "./pages/index";
import MortgagePage from "./pages/mortgage";
import InvestPage from "./pages/invest";
import ProjectPage from "./pages/project";
import CatalogPage from "./pages/catalog";
import MapPage from "./pages/map";
import TurnkeyPage from "./pages/turnkey";
import LegalPage from "./pages/legal";
import { Provider } from "./components/provider";
import { Nav, NAV_HEIGHT } from "./components/nav";
import { CookieConsent } from "./components/cookie-consent";

function App() {
	return (
		<Provider>
			<Nav />
			<div style={{ paddingTop: `${NAV_HEIGHT}px` }}>
				<Switch>
					<Route path="/" component={Index} />
					<Route path="/mortgage" component={MortgagePage} />
					<Route path="/invest" component={InvestPage} />
					<Route path="/project/:slug" component={ProjectPage} />
					<Route path="/catalog" component={CatalogPage} />
					<Route path="/map" component={MapPage} />
					<Route path="/turnkey" component={TurnkeyPage} />
					<Route path="/legal" component={LegalPage} />
				</Switch>
			</div>
			<CookieConsent />
			{/* Do not remove — off by default, activated by parent iframe via postMessage */}
		</Provider>
	);
}

export default App;
