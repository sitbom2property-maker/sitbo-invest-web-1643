import { Route, Switch, useLocation } from "wouter";
// Redesigned homepage. To roll back to the previous design, swap this import
// for `./pages/index` (the old page is still in the repo, untouched).
import Index from "./pages/home-v2";
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
import AminaPage from "./pages/amina";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import PropertyForm from "./pages/admin/PropertyForm";
import { Provider } from "./components/provider";
import { LocaleProvider } from "./context/LocaleContext";
import { RatesProvider } from "./context/RatesContext";
import { Nav, NAV_HEIGHT } from "./components/nav";
// Redesigned footer. Roll back by importing `Footer` from "./components/footer".
import { FooterV2 as Footer } from "./components/FooterV2";
import { CookieConsent } from "./components/cookie-consent";
import { LeadPopup } from "./components/LeadPopup";
import { FloatingConsultation } from "./components/FloatingConsultation";
import { ScrollToHash } from "./components/scroll-to-hash";
import { ScrollRestore } from "./components/scroll-restore";
import { PageMeta } from "./components/PageMeta";
import { ContentProtection } from "./components/ContentProtection";

function isAminaPath(location: string) {
	return location === "/amina" || location.startsWith("/amina/");
}

function AppNav() {
	const [location] = useLocation();
	if (location.startsWith("/admin") || isAminaPath(location)) return null;
	return <Nav />;
}

function AppFooter() {
	const [location] = useLocation();
	if (location.startsWith("/admin") || isAminaPath(location)) return null;
	return <Footer />;
}

function AppLeadPopup() {
	const [location] = useLocation();
	if (location.startsWith("/admin") || isAminaPath(location)) return null;
	return <LeadPopup />;
}

function AppFloatingConsult() {
	const [location] = useLocation();
	if (location.startsWith("/admin") || isAminaPath(location)) return null;
	return <FloatingConsultation />;
}

function AppMain() {
	const [location] = useLocation();
	const isHome = location === "/";
	const isAmina = isAminaPath(location);
	return (
		<div
			style={{
				paddingTop: isHome || isAmina ? 0 : `var(--nav-height, ${NAV_HEIGHT}px)`,
			}}
		>
			<Switch>
				<Route path="/" component={Index} />
				<Route path="/amina" component={AminaPage} />
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
	);
}

function App() {
	return (
		<LocaleProvider>
		<RatesProvider>
		<Provider>
			<ScrollRestore />
			<ScrollToHash />
			<PageMeta />
			<ContentProtection />
			<AppNav />
			<AppMain />
			<AppFooter />
			<AppLeadPopup />
			<AppFloatingConsult />
			<CookieConsent />
			{/* Do not remove — off by default, activated by parent iframe via postMessage */}
		</Provider>
		</RatesProvider>
		</LocaleProvider>
	);
}

export default App;
