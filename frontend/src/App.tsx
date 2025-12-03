import React, { createContext, useContext } from 'react';
import { Web3Provider } from './contexts/Web3Context';
import { Header } from './components/Header';
import { ProductList } from './pages/ProductList';
import { CreateProduct } from './pages/CreateProduct';

type Page = 'list' | 'create';

interface NavigationContextType {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

function App() {
  const [currentPage, setCurrentPage] = React.useState<Page>('list');

  React.useEffect(() => {
    const path = window.location.pathname;
    if (path === '/create') {
      setCurrentPage('create');
    } else {
      setCurrentPage('list');
    }
  }, []);

  const navigate = (page: Page) => {
    const path = page === 'create' ? '/create' : '/';
    window.history.pushState({}, '', path);
    setCurrentPage(page);
  };

  return (
    <NavigationContext.Provider value={{ currentPage, navigate }}>
      <Web3Provider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            {currentPage === 'list' ? <ProductList /> : <CreateProduct />}
          </main>
        </div>
      </Web3Provider>
    </NavigationContext.Provider>
  );
}

export default App;
