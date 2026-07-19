import { Route, Switch } from "wouter";
import Index from "./pages/index";
import MortgagePage from "./pages/mortgage";
import InvestPage from "./pages/invest";
import ProjectPage from "./pages/project";
import CatalogPage from "./pages/catalog";
import TurnkeyPage from "./pages/turnkey";
import ServicesPage from "./pages/Services";
import LegalPage from "./pages/legal";
import BlogPage from "./pages/blog";
import BlogPostPage from "./pages/blog-post";
import HistoryPage from "./pages/history";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import PropertyForm from "./pages/admin/PropertyForm";
import { Provider } from "./components/provider";
import { LocaleProvider } from "./context/LocaleContext";
import { Nav, NAV_HEIGHT } from "./components/nav";
import { CookieConsent } from "./components/cookie-consent";
import { ScrollToHash } from "./components/scroll-to-hash";

function App() {
	return (
		<LocaleProvider>
		<Provider>
			<ScrollToHash />
			<Nav />
			<div style={{ paddingTop: `var(--nav-height, ${NAV_HEIGHT}px)` }}>
				<Switch>
					<Route path="/" component={Index} />
					<Route path="/mortgage" component={MortgagePage} />
					<Route path="/invest" component={InvestPage} />
					<Route path="/history" component={HistoryPage} />
					<Route path="/blog/:slug" component={BlogPostPage} />
					<Route path="/blog" component={BlogPage} />
					<Route path="/project/:slug" component={ProjectPage} />
					<Route path="/catalog" component={CatalogPage} />
					<Route path="/turnkey" component={TurnkeyPage} />
					<Route path="/services" component={ServicesPage} />
					<Route path="/legal" component={LegalPage} />
					<Route path="/admin/login" component={AdminLogin} />
					<Route path="/admin/property/new">
						{() => <PropertyForm />}
					</Route>
					<Route path="/admin/property/:id">
						{(params) => <PropertyForm propertyId={params.id} />}
					</Route>
					<Route path="/admin" component={AdminDashboard} />
				</Switch>
			</div>
			<CookieConsent />
			{/* Do not remove — off by default, activated by parent iframe via postMessage */}
		</Provider>
		</LocaleProvider>
	);
}

export default App;
