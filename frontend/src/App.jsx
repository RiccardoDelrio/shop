import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import SizeTable from './pages/Size-table';

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
<<<<<<< HEAD
            <Route path='/products/:slug' element={<MacroAreaPage />} />
=======
            <Route path="/size-table" element={<SizeTable />} />
>>>>>>> page/size-table

          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
