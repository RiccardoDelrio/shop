import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import SizeTable from './pages/Size-table';
import StorySite from './pages/Story-site';
import PrivacyPolicy from './pages/Privacy-policy';
import Contacts from './pages/Contacts';
import ProductDetails from './pages/ProductDetails'; // Import the new ProductDetails page

import DefaultLayout from "./layout/defaultLayout";
import MacroAreaPage from './pages/MacroAreaPage';



function App() {

  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />

            <Route path="/catalogo" element={<Catalogo />} />
            <Route path='/products' element={<MacroAreaPage />} />
            <Route path="/size-table" element={<SizeTable />} />
            <Route path="/story-site" element={<StorySite />} />
            < Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
