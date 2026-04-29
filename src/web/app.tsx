  import { Route, Switch } from "wouter";                                                                                
   import Index from "./pages/index";
   import MortgagePage from "./pages/mortgage";
   import InvestPage from "./pages/invest";
   import ProjectPage from "./pages/project";
   import CatalogPage from "./pages/catalog";
   import TurnkeyPage from "./pages/turnkey";
   import { Provider } from "./components/provider";                                                                      
   import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";                                                                            
                                                                                                                          
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
         </Switch>                                                                                                        
         {/* Do not remove — off by default, activated by parent iframe via postMessage */}                                                  
         {import.meta.env.DEV && <AgentFeedback />}                                                                       
         {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}                                                                     
         {<RunableBadge />}                                                                        
       </Provider>                                                                                                        
     );                                                                                                                   
   }                                                                                                                      
                                                                                                                          
   export default App; 