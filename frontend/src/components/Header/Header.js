import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Header.scss";
import Logo from "../../assets/images/logo.png";
import jsonData from "../../services/data.json";
import { useIsMobile } from "../../hooks/useIsMobile";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import ModalPopup from "../ModalPopup/ModalPopup";
import { searchProductApi, getImageUrl } from "../../services/api";
import ProductCard from "../ProductCard/ProductCard";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openMenuItem, setOpenMenuItem] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { offers } = jsonData;
  const isMobile = useIsMobile();

  useEffect(() => {
    setOpenMenu(false);
    setOpenMenuItem(false);
  }, [location.pathname]);

  // Debounced search function
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      setSearchError(null);

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await searchProductApi(searchQuery);

          setSearchResults(res.data.data);
        } catch (error) {
          setSearchError("Failed to search products");
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300); // 300ms debounce
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to list page with search query
      navigate(`/list?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setOpenSearch(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const MenuItemUi = () => {
    return (
      <nav className="nav">
        <Link to="/">Home</Link>
        <div
          className="dropdown"
          onMouseEnter={() => !isMobile && setOpenMenuItem(true)}
          onMouseLeave={() => !isMobile && setOpenMenuItem(false)}
          onClick={() => isMobile && setOpenMenuItem(!openMenuItem)}
        >
          <button className="dropdown-btn">Shop{isMobile ? null : "▾"}</button>
          {openMenuItem && (
            <div className="dropdown-menu">
              <Link to="/list">All Products</Link>
              <Link to="/list/masala">Masala</Link>
              <Link to="/list/snacks">Snacks</Link>
              <Link to="/list/pickles">Pickles</Link>
            </div>
          )}
        </div>
        <Link to="/contact">Contact</Link>
      </nav>
    );
  };

  return (
    <>
      <section className="announcement-bar">
        <div className="announcement-track">
          {offers.map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </section>
      <header className="header-cntnr">
        <div className="header-main">
          <Link to="/">
            <img className="logo" src={Logo} alt="logo" />
          </Link>
          {isMobile ? (
            <div className="mobile-menu">
              <span
                onClick={() => {
                  setOpenSearch(!openSearch);
                }}
                className="search"
              >
                <SearchIcon />
              </span>
              <span className="ham-burger" onClick={() => setOpenMenu(true)}>
                <MenuIcon />
              </span>
            </div>
          ) : (
            <>
              {MenuItemUi()}
              <div className="search-wrapper">
                <form className="search" onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    aria-label="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <SearchIcon />
                </form>
                {/* Desktop Search Results Dropdown */}
                {searchQuery.trim().length > 0 && (
                  <div className="search-results-dropdown">
                    {isSearching ? (
                      <div className="search-loading">Searching...</div>
                    ) : searchError ? (
                      <div className="search-error">{searchError}</div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <div className="search-results-list">
                          {searchResults.slice(0, 5).map((product) => (
                            <Link
                              key={product._id}
                              to={`/details/${product._id}`}
                              className="search-result-item"
                              onClick={() => setSearchQuery("")}
                            >
                              <img
                                src={
                                  getImageUrl(product.thumbnail) ||
                                  "/placeholder.jpg"
                                }
                                alt={product.name}
                              />
                              <div>
                                <div className="search-result-name">
                                  {product.name}
                                </div>
                                <div className="search-result-price">
                                  ₹{product.price}
                                </div>
                              </div>
                            </Link>
                          ))}
                          {searchResults.length > 5 && (
                            <Link
                              to={`/list?search=${encodeURIComponent(searchQuery)}`}
                              className="search-result-view-all"
                              onClick={() => setSearchQuery("")}
                            >
                              View all {searchResults.length} results
                            </Link>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="search-no-results">No products found</div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>
      <ModalPopup
        open={openSearch}
        handleClose={() => {
          setOpenSearch(false);
          setSearchQuery("");
        }}
        title="Search Products"
      >
        <div className="mobile-search-content">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
            />
            <button type="submit">
              <SearchIcon />
            </button>
          </form>

          {isSearching && <div className="search-loading">Searching...</div>}

          {searchError && <div className="search-error">{searchError}</div>}

          {searchQuery.trim().length > 0 && !isSearching && (
            <div className="mobile-search-results">
              {searchResults.length > 0 ? (
                <>
                  <div className="mobile-products-grid">
                    {searchResults.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={{
                          ...product,
                          id: product._id,
                          image: getImageUrl(product.thumbnail),
                        }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="search-no-results">No products found</div>
              )}
            </div>
          )}
        </div>
      </ModalPopup>
      <Drawer anchor="left" open={openMenu} onClose={() => setOpenMenu(false)}>
        <Box sx={{ width: "90vw" }}>{MenuItemUi()}</Box>
      </Drawer>
    </>
  );
}
