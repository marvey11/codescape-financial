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
  AddOperationPage,
  AddPortfolioPage,
  EditPortfolioPage,
  PortfolioDetailsPage,
  PortfolioHoldingDetailsPage,
  PortfolioHoldingLayout,
  PortfolioHoldingListPage,
  PortfolioLayout,
  PortfolioListPage,
  PortfolioOperationListPage,
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
        <Route path="add" element={<AddPortfolioPage />} />
        <Route path=":portfolioId" element={<PortfolioLayout />}>
          <Route index element={<PortfolioDetailsPage />} />
          <Route path="edit" element={<EditPortfolioPage />} />
          <Route path="holdings">
            <Route index element={<PortfolioHoldingListPage />} />
            <Route path=":holdingId" element={<PortfolioHoldingLayout />}>
              <Route index element={<PortfolioHoldingDetailsPage />} />
              <Route path="operations">
                <Route index element={<PortfolioOperationListPage />} />
                <Route path="add" element={<AddOperationPage />} />
              </Route>
            </Route>
          </Route>
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
