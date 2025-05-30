import { useState, useEffect } from "react";
import { apartmentsApi } from "../api/apartments";
import { Apartment } from "../types/apartment";

export function useApartments() {
  const [apartments, setApartments] = useState<{
    data?: { content: Apartment[] };
    isLoading: boolean;
    isError: boolean;
    error?: any;
  }>({
    isLoading: true,
    isError: false,
  });

  const fetchApartments = async () => {
    try {
      setApartments((prev) => ({ ...prev, isLoading: true, isError: false }));
      const data = await apartmentsApi.getApartments();
      setApartments({ data, isLoading: false, isError: false });
    } catch (error) {
      setApartments({ isLoading: false, isError: true, error });
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  return { apartments, fetchApartments };
}
