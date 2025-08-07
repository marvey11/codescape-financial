import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./app/App";
import {
  AddCountryPage,
  CountryDetailsPage,
  CountryLayout,
  CountryListPage,
  EditCountryPage,
} from "./pages/countries";
import {
  PortfolioDetailsPage,
  PortfolioLayout,
  PortfolioListPage,
} from "./pages/portfolios";
import {
  AddStockMetadataPage,
  EditStockMetadataPage,
  StockMetadataDetailsPage,
  StockMetadataLayout,
  StockMetadataListPage,
} from "./pages/stocks";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="portfolios">
        <Route index element={<PortfolioListPage />} />
        <Route path=":id" element={<PortfolioLayout />}>
          <Route index element={<PortfolioDetailsPage />} />
        </Route>
      </Route>

      <Route path="stocks">
        <Route index element={<StockMetadataListPage />} />
        <Route path="add" element={<AddStockMetadataPage />} />
        <Route path=":id" element={<StockMetadataLayout />}>
          <Route index element={<StockMetadataDetailsPage />} />
          <Route path="edit" element={<EditStockMetadataPage />} />
        </Route>
      </Route>

      <Route path="countries">
        <Route index element={<CountryListPage />} />
        <Route path="add" element={<AddCountryPage />} />
        <Route path=":id" element={<CountryLayout />}>
          <Route index element={<CountryDetailsPage />} />
          <Route path="edit" element={<EditCountryPage />} />
        </Route>
      </Route>
    </Route>,
  ),
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
