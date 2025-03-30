"use client";

import React, { useState, useEffect } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { searchAddress } from "../../../../services/service/map-servie.tsx";
import {useTranslation} from "react-i18next";
import Spinner from "../../../../components/sniper/sniper.tsx";

type SearchResult = {
  id: string;
  position: { lat: number; lon: number };
  address: string;
};

interface SearchProps {
  onSearchResultSelect: (position: { lat: number; lon: number }, address: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchResultSelect }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (query.trim()) {
      setIsOpen(true);
      const debounceTimeout = setTimeout(handleSearch, 500);
      return () => clearTimeout(debounceTimeout);
    } else {
      setResults([]);
      setIsOpen(true);
    }
  }, [query]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await searchAddress(query);
      const data = await response;
      const searchResults = data.results.slice(0, 4).map((result: any) => ({
        id: result.id,
        position: result.position,
        address: result.address.freeformAddress,
      }));

      setResults(searchResults);

    } catch (error) {
      console.error("Erreur lors de la récupération des données de TomTom API :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    setQuery(result.address);
    setIsOpen(false);
    onSearchResultSelect(result.position, result.address);
  };

  return (
      <div className="relative w-full mt-2">
        <p>{t("map.look-place")}</p>
        <div className="relative mt-2">

          <input
              type="text"
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              placeholder="Rechercher une adresse..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(results.length > 0)}
              onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          />
          <ChevronUpDownIcon
              className="absolute right-3 top-2 size-5 text-gray-500 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
          />
          {isLoading &&(
              <div className="absolute right-10 top-2 size-5 text-gray-500 cursor-pointer">
                <Spinner/>
              </div>
          )}
        </div>


        {isOpen && results.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-300">
              {results.map((result) => (
                  <li
                      key={result.id}
                      className="cursor-pointer px-3 py-2 hover:bg-indigo-600 hover:text-white"
                      onMouseDown={() => handleResultSelect(result)}
                  >
                    {result.address}
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
};

export default Search;
