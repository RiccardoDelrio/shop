import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import SizeTable from './pages/Size-table';
import StorySite from './pages/Story-site';
import PrivacyPolicy from './pages/Privacy-policy';
import Contacts from './pages/Contacts';
import ProductDetails from './pages/ProductDetails';
import Carello from './pages/PageCarello';
import DefaultLayout from "./layout/defaultLayout";
import WardrobeSectionPage from './pages/WardrobeSectionPage'; // renamed from MacroAreaPage
import SearchPage from './pages/SearchPage';
import Checkout from './pages/Checkout/Checkout';
import NotFound from './pages/NotFound'; // Updated import path from components to pages


function App() {

  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Navigate to="/search" replace />} />

            <Route path="/wardrobe-section/:slug" element={<WardrobeSectionPage />} />
            <Route path="/size-table" element={<SizeTable />} />
            <Route path="/story-site" element={<StorySite />} />
            < Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/carello" element={<Carello />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/search/:query" element={<SearchPage />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
