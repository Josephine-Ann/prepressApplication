import React, { useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Header from '../Header/Header';
import PrintJobList from '../PrintJobList/PrintJobList';
import WebViewerPrintJob from '../WebViewerPrintJob/WebViewerPrintJob';

import { PrintJobContext } from '../../PrintJobInfoProvider';

const FunctionContextComponent = () => {
  const { unfilteredPrintJobList } = useContext(PrintJobContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <PrintJobList printJobList={unfilteredPrintJobList} />
    },
    {
      path: "/:jobPDF",
      element: <WebViewerPrintJob />,
    },
  ]);

  return (
    <>
      <Header />
      <RouterProvider router={router} />
    </>
  );
};

export default FunctionContextComponent;
