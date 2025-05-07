import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import SizeTable from './pages/Size-table';
import StorySite from './pages/Story-site';

import DefaultLayout from "./layout/defaultLayout";
import MacroAreaPage from './pages/MacroAreaPage';
import PrivacyPolicy from './pages/Privacy-policy';


function App() {

  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />

            <Route path="/catalogo" element={<Catalogo />} />
            <Route path='/products/:slug' element={<MacroAreaPage />} />
            <Route path="/size-table" element={<SizeTable />} />
            <Route path="/story-site" element={<StorySite />} />
            < Route path="/privacy-policy" element={<PrivacyPolicy />} />

          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
