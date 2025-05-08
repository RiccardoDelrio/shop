import React, { useEffect } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router'
import { useGlobal } from '../contexts/GlobalContext'
import ProductCards from "../components/ProductCard/ProductCard";

const MacroAreaPage = () => {
    // Hook per gestire i parametri della query string
    const [searchParams, setSearchParams] = useSearchParams()

    // Informazioni sull'URL attuale
    const location = useLocation()

    // Nuova istanza di URLSearchParams (vuota per ora)
    /*  const params = new URLSearchParams(); */

    console.log(location.search.length);
    // Importa dallo stato globale i metodi e gli stati delle macro aree
    const {
        fetchIndexMacroArea,
        accessories,
        setAccessories,
        bottom,
        setBottom,
        top,
        setTop,
        visualizedProducts,
        setVisualizedProducts
    } = useGlobal()


    // Imposta multipli parametri di ricerca (al momento vuoti)
    /*  const setMultipleParams = () => {
         setSearchParams(params)
     } */

    // Funzione che fa fetch dei dati per tutte le aree selezionate (se non già presenti)
    function fetchData() {
        if (visualizedProducts.length < 1) {
            let allProducts = [];
            let completedFetches = 0

            // Per ogni area selezionata nella query string, fai il fetch dei prodotti
            foundedArea.forEach(area => {
                fetchIndexMacroArea(area.name, (data) => {
                    area.setState(data)
                    allProducts = [...allProducts, ...data]
                    completedFetches++

                    // Quando tutti i fetch sono completati, aggiorna lo stato globale
                    if (completedFetches === foundedArea.length) {
                        setVisualizedProducts(allProducts)
                    }
                })
            })
        }
    }
    console.log(visualizedProducts);


    // useEffect iniziale: imposta i parametri e avvia il fetch dei dati
    /* useEffect(() => {
        if (searchParams.getAll('macro_area').length > 0) {
            fetchData(); // Rilancia il fetch se cambiano i parametri
        }
    }, [searchParams]); */
    useEffect(() => {
        const selectedAreas = areas.filter(area =>
            searchParams.getAll('macro_area').includes(area.name)
        );

        let allProducts = [];
        let fetchCount = 0;
        let completedFetches = 0;

        selectedAreas.forEach(area => {
            if (area.state.length === 0) {
                // ⚠️ Solo se l'area non è stata fetchata
                fetchCount++;
                fetchIndexMacroArea(area.name, (data) => {
                    area.setState(data);
                    allProducts = [...allProducts, ...data];
                    completedFetches++;

                    if (completedFetches === fetchCount) {
                        setVisualizedProducts(prev => {
                            // Combina i vecchi prodotti già presenti per altre aree + nuovi fetchati
                            const alreadyFetched = selectedAreas
                                .filter(a => a.state.length > 0)
                                .flatMap(a => a.state);
                            return [...alreadyFetched, ...allProducts];
                        });
                    }
                });
            }
        });

        // Se nessun fetch da fare, aggiorna solo con quelli già presenti
        if (fetchCount === 0) {
            const alreadyFetched = selectedAreas
                .filter(a => a.state.length > 0)
                .flatMap(a => a.state);
            setVisualizedProducts(alreadyFetched);
        }
    }, [searchParams]);





    /* useEffect(() => {
  const selectedAreas = areas.filter(area =>
    searchParams.getAll('macro_area').includes(area.name)
  );

  let allProducts = [...visualizedProducts];
  let completedFetches = 0;
  let fetchCount = 0;

  selectedAreas.forEach(area => {
    if (area.state.length === 0) {
      // Area non ancora fetchata → fetch now
      fetchCount++;
      fetchIndexMacroArea(area.name, (data) => {
        area.setState(data);
        allProducts = [...allProducts, ...data];
        completedFetches++;

        if (completedFetches === fetchCount) {
          setVisualizedProducts(allProducts);
        }
      });
    } else {
      // Area già fetchata → includi comunque i suoi prodotti
      allProducts = [...allProducts, ...area.state];
    }
  });

  // Se non ci sono fetch da fare ma i visualizedProducts non sono aggiornati
  if (fetchCount === 0) {
    setVisualizedProducts(allProducts);
  }
}, [searchParams]);
 */

    // Debug: stampa dei parametri dalla query
    console.log(searchParams.getAll('macro_area'));


    // Estrae lo slug dalla route (es. /macro-area/:slug)




    // Array che rappresenta le tre macro aree gestite nel sistema
    const areas = [{
        state: accessories,
        setState: setAccessories,
        name: 'accessori'
    }, {
        state: top,
        setState: setTop,
        name: 'upper-body'
    }, {
        state: bottom,
        setState: setBottom,
        name: 'lower-body'
    }]

    // Trova l'area corrente in base allo slug


    // Debug: log dell'area corrispondente allo slug


    // Trova le aree corrispondenti ai parametri nella query string
    const foundedArea = areas.filter(area => searchParams.getAll('macro_area').includes(area.name))

    // Debug: log delle aree trovate dai parametri
    console.log('FindArea', foundedArea);



    // Debug: stampa i prodotti visualizzati dopo il fetch
    console.log('Prodotti visualizzati', visualizedProducts);

    // Gestione del toggle per i checkbox delle macro aree (aggiunta o rimozione del parametro nella query string)
    function handleCheck(e) {
        const current = new URLSearchParams(searchParams);
        const name = e.target.name;

        if (searchParams.getAll('macro_area').includes(name)) {
            // Rimuove il parametro se già presente
            current.delete('macro_area', name);
        } else {
            // Aggiunge il parametro se non presente
            current.append('macro_area', name);
        }

        // Aggiorna i parametri nella query string
        setSearchParams(current);
    }

    // Render dei checkbox per selezionare le macro aree da visualizzare
    return (
        <div>

        </div>
    )
}

export default MacroAreaPage
