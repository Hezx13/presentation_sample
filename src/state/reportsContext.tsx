import React, { createContext, useState, useEffect, useContext } from 'react';
import { loadReports } from '../api';

// Define the shape of the context
type ReportContextType = {
  reports: Report[];
  fetchReports: () => void;
  updateReports: () => void;
};

type Report = {
  materials: any[];
  month: any;
  debit: number[];
  payment: string;
  credit: number;
  activeProjects: any[];
};

// Create the context with a default undefined value
const ReportContext = createContext<ReportContextType | undefined>(undefined);

// Create a provider component
export const ReportProvider: React.FC = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsUpdated, setReportsUpdated] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [reportsUpdated]);

  const fetchReports = async () => {
    const fetchedReports = await loadReports();
    setReports(fetchedReports);
    // calculateTotalReports(fetchedReports); // Assuming you have this function defined
  };

  const updateReports = () => {
    console.log('updateReports called');
    setReportsUpdated(!reportsUpdated);
  };

  return (
    <ReportContext.Provider value={{ reports, fetchReports, updateReports }}>
      {children}
    </ReportContext.Provider>
  );
};

// Custom hook to use the ReportContext
export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};
