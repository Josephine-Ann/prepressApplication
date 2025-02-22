const handleResize = (setIsMobile, filterPrintJobs) => {
    setIsMobile(window.innerWidth < 768);
    filterPrintJobs("all");
};

export default handleResize;