import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import SimpleBottomNavigation from "./components/MainNav";
import Movies from "./Pages/Movies/Movies";
import Series from "./Pages/Series/Series";
import Trending from "./Pages/Trending/Trending";
import Search from "./Pages/Search/Search";
import Sidebar from "./components/Sidebar/Sidebar";
import { Container } from "@material-ui/core";

function App() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [quickSearchText, setQuickSearchText] = useState("");

  return (
    <BrowserRouter>
      <Header />
      <div className="app">
        <div style={{ display: "flex", width: "100%" }}>
          <Sidebar
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
            quickSearchText={quickSearchText}
            setQuickSearchText={setQuickSearchText}
          />
          <div style={{ flex: 1, width: "100%" }}>
            <Switch>
              <Route path="/" component={Trending} exact />
              <Route path="/movies">
                <Movies
                  selectedGenres={selectedGenres}
                  setSelectedGenres={setSelectedGenres}
                  quickSearchText={quickSearchText}
                />
              </Route>
              <Route path="/series">
                <Series
                  selectedGenres={selectedGenres}
                  setSelectedGenres={setSelectedGenres}
                  quickSearchText={quickSearchText}
                />
              </Route>
              <Route path="/search" component={Search} />
            </Switch>
          </div>
        </div>
      </div>
      <SimpleBottomNavigation />
    </BrowserRouter>
  );
}

export default App;
