import { Switch, Route } from "wouter";
import HomePage from "@/pages/HomePage";
import TravelPlannerPage from "@/pages/TravelPlannerPage";
import ArticlePage from "@/pages/ArticlePage";
import CategoryPage from "@/pages/CategoryPage";
import SearchResultsPage from "@/pages/SearchResultsPage";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function App() {
  return (
    <Switch>
      <Route path="/planificador" component={TravelPlannerPage} />
      <Route>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow">
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/articulo/:slug" component={ArticlePage} />
              <Route path="/categoria/:slug" component={CategoryPage} />
              <Route path="/buscar" component={SearchResultsPage} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Route>
    </Switch>
  );
}

export default App;
