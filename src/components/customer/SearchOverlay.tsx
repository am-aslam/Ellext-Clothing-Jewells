'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowUpRight, Clock, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { api } from '@/services/api';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_KEY = 'ellext_recent_searches';

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Polki Choker',
    'Silk Blazer',
    'Emerald',
    'Diamond Cuff',
    'Banarasi Saree'
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const found = await api.getProducts({ search: query.trim() });
        setResults(found);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectRecent = (term: string) => {
    setQuery(term);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const updated = [query.trim(), ...recentSearches.filter(s => s.toLowerCase() !== query.trim().toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {}
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_KEY);
  };

  if (!isOpen) return null;

  return (
    <div className="elx-search-overlay" role="dialog" aria-modal="true">
      <div className="search-overlay-backdrop" onClick={onClose} />
      <div className="search-overlay-container">
        <div className="elx-container">
          {/* Top Bar with Input and Close */}
          <div className="search-input-header">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <Search size={22} className="search-icon" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search jewellery, silks, collections, diamonds..."
                className="search-input"
                aria-label="Search product catalogue"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="search-clear-btn"
                  aria-label="Clear search input"
                >
                  <X size={18} />
                </button>
              )}
            </form>
            <button
              type="button"
              onClick={onClose}
              className="search-close-btn"
              aria-label="Close search overlay"
            >
              <X size={24} />
            </button>
          </div>

          {/* Quick Categories Bar */}
          <div className="search-quick-categories">
            <span className="quick-label">Explore:</span>
            <Link href="/clothing" onClick={onClose} className="quick-category-pill">
              Couture Clothing
            </Link>
            <Link href="/jewells" onClick={onClose} className="quick-category-pill">
              Fine Jewells
            </Link>
            <Link href="/collections" onClick={onClose} className="quick-category-pill">
              The Ellext Edit
            </Link>
            <Link href="/offers" onClick={onClose} className="quick-category-pill">
              Active Offers
            </Link>
          </div>

          <div className="search-content-area">
            {/* Live Search Results */}
            {query.trim() ? (
              <div className="search-results-pane">
                <div className="search-results-header">
                  <h3>
                    {loading
                      ? 'Searching the atelier...'
                      : `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
                  </h3>
                  {results.length > 0 && (
                    <Link
                      href={`/shop?search=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="view-all-results-link"
                    >
                      View all results <ArrowUpRight size={14} />
                    </Link>
                  )}
                </div>

                {results.length > 0 ? (
                  <div className="search-results-grid">
                    {results.slice(0, 6).map(prod => (
                      <Link
                        key={prod.id}
                        href={`/product/${prod.slug}`}
                        onClick={onClose}
                        className="search-result-card"
                      >
                        <div className="search-result-thumb">
                          <Image
                            src={prod.coverImage || prod.images[0]}
                            alt={prod.name}
                            width={80}
                            height={96}
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="search-result-info">
                          <span className="search-result-category">
                            {prod.category === 'jewells' ? 'Fine Jewellery' : 'Couture Clothing'}
                          </span>
                          <h4 className="search-result-title">{prod.name}</h4>
                          <div className="search-result-price">
                            <span className="price-now">₹{prod.sellingPrice.toLocaleString('en-IN')}</span>
                            {prod.originalPrice > prod.sellingPrice && (
                              <span className="price-was">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : !loading ? (
                  <div className="search-no-results">
                    <p className="no-results-title">No pieces matching &ldquo;{query}&rdquo;</p>
                    <p className="no-results-subtitle">
                      Please verify spelling or explore our signature collections below.
                    </p>
                    <div className="no-results-suggestions">
                      <button
                        onClick={() => setQuery('Polki')}
                        className="suggestion-btn"
                      >
                        Polki Chokers
                      </button>
                      <button
                        onClick={() => setQuery('Blazer')}
                        className="suggestion-btn"
                      >
                        Silk Blazers
                      </button>
                      <button
                        onClick={() => setQuery('Diamond')}
                        className="suggestion-btn"
                      >
                        Diamond Cuffs
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              /* Idle state: Recent searches & Trending suggestions */
              <div className="search-idle-pane">
                {recentSearches.length > 0 && (
                  <div className="search-recent-section">
                    <div className="section-title-wrap">
                      <span className="section-title">
                        <Clock size={14} /> Recent Searches
                      </span>
                      <button onClick={clearRecent} className="clear-btn">
                        Clear all
                      </button>
                    </div>
                    <div className="recent-tags-list">
                      {recentSearches.map(term => (
                        <button
                          key={term}
                          onClick={() => handleSelectRecent(term)}
                          className="recent-tag"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="search-trending-section">
                  <span className="section-title">
                    <Sparkles size={14} /> Trending In Atelier
                  </span>
                  <div className="trending-tags-list">
                    <button onClick={() => setQuery('Emerald')} className="trending-tag">
                      Zambian Emeralds
                    </button>
                    <button onClick={() => setQuery('Banarasi')} className="trending-tag">
                      Banarasi Tissue Organza
                    </button>
                    <button onClick={() => setQuery('Choker')} className="trending-tag">
                      Bridal Choker Sets
                    </button>
                    <button onClick={() => setQuery('Evening Gown')} className="trending-tag">
                      Bias-Cut Silk Gowns
                    </button>
                    <button onClick={() => setQuery('Kada')} className="trending-tag">
                      Temple Gold Kadas
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
