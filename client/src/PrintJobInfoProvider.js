import React, { createContext, Component } from "react";
import axios from "axios";

export const PrintJobContext = createContext();

class PrintJobInfoProvider extends Component {
  state = {
    printJobList: [],
    unfilteredPrintJobList: [],
    selectedStatus: "all",
    selectedClient: "",
    currentPage: "",
    shouldFlattenAndSend: false,
    modalOpen: false,
  };

  getAutomatedComments = async commentObj => {
    try {
      const response = await axios.get("http://localhost:3000/automatedComments");
      const { errors, opening, closing, manager } = response.data;
      const emailStructure = { manager, errors: [...Object.keys(commentObj).filter(com => commentObj[com]).map(com => errors[com])], opening, closing };
      return emailStructure
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  downloadFile = async (fileName) => {
    try {
      const response = await fetch(`http://localhost:3000/download/${fileName}`);
      if (!response.ok) {
        throw new Error("File not found");
      }

      const arrayBuffer = await response.arrayBuffer();

      const uint8Array = new Uint8Array(arrayBuffer);

      const blob = new Blob([uint8Array]);


      if (blob.size === 0) {
        throw new Error("File content is empty.");
      }

      const objectURL = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectURL;
      link.download = fileName;
      link.click();

      URL.revokeObjectURL(objectURL);
    } catch (error) {
      console.error("Error creating blob:", error);
    }
  };


  checkForAutomatedComments = (jobPDF) => {
    const printJob = this.state.printJobList.find(pj => pj.img === jobPDF);
    const surfaceArea = printJob.dimensions.replace(" cm", "").split("x").map(n => parseInt(n, 10)).reduce((acc, num) => acc * num, 1);
    console.log("checkForAutomatedComments ", surfaceArea, " ", printJob.diecutCode)
    return this.getAutomatedComments({
      'resolution': printJob.resolutionInPPI < 330,
      'colorSpace': printJob.colorSpace.toLowerCase() !== "spot color",
      'dimensionsToDieCut15': surfaceArea <= 15 && printJob.diecutCode > 50,
      'dimensionsToDieCut40': surfaceArea <= 40 && surfaceArea > 15 && printJob.diecutCode > 100,
      'dimensionsToDieCut90': surfaceArea <= 90 && surfaceArea > 40 && printJob.diecutCode > 120,
      'dimensionsToDieCut200': surfaceArea <= 200 && surfaceArea > 90 && printJob.diecutCode > 150,
      'violationEU11692011Food': printJob.fontSize < 1.2 && printJob.isNutrition,
      'violationEU11692011Med': printJob.fontSize < 0.9 && printJob.isMedical
    });
  }


  updateShouldFlattenAndSend = () => this.setState({ shouldFlattenAndSend: !this.state.shouldFlattenAndSend });

  updatePrintJob = (id, newStatus) => {
    this.setState(prevState => ({
      printJobList: prevState.printJobList.map(job =>
        job.id === id ? { ...job, status: newStatus } : job
      )
    }));
    this.setState(prevState => ({
      unfilteredPrintJobList: prevState.unfilteredPrintJobList.map(job =>
        job.id === id ? { ...job, status: newStatus } : job
      )
    }));
  };

  filterPrintJobs = (status = this.state.status, client = "") => {
    const { unfilteredPrintJobList } = this.state;
    let filteredList;
    if (status !== "" && client === "" && status !== "all") {
      filteredList = unfilteredPrintJobList.filter(job => job.status.toLowerCase() === status.toLowerCase());
    } else if (status === "" && client !== "" && status !== "all") {
      filteredList = unfilteredPrintJobList.filter(job => (job.client).toLowerCase().includes((client).toLowerCase()));
    } else if (status !== "" && client !== "" && status !== "all") {
      filteredList = unfilteredPrintJobList.filter(job => job.client === (job.client).toLowerCase().includes((client).toLowerCase()) && job.status.toLowerCase() === status.toLowerCase());
    } else {
      filteredList = [...unfilteredPrintJobList];
    }
    this.setState({ printJobList: filteredList, selectedStatus: status });
  };

  getPrintJobs = async () => {

    try {
      const response = await axios.get("http://localhost:3000/printJobs");

      this.setState({ printJobList: response.data.printJobs, unfilteredPrintJobList: response.data.printJobs });
    } catch (error) {
      console.error("Error fetching print jobs:", error);
    }
  };

  openOrCloseModal = () => {
    this.setState(prevState => ({
      modalOpen: !prevState.modalOpen
    }));
  }

  sendEmailWithPDF = file => {

    const formData = new FormData();
    formData.append('pdf', file, 'test.pdf');

    axios.post('http://localhost:3000/send-email', formData)
      .then(response => console.log('Email sent:', response))
      .catch(error => console.error('Error sending email:', error));
  };

  getPage = () => {
    const currentPage = document.URL;
    this.setState({ currentPage });
  }

  getDiecutAndUpdateComments = (jobPDF, errors) => {
    const diecut = this.state.unfilteredPrintJobList.find(pj => pj.img === jobPDF).diecutCode;
    return errors.map(e => e.includes('{}') ? e.replace('{}', diecut) : e)
  }


  componentDidMount() {
    this.getPrintJobs();
  }

  render() {
    return (
      <PrintJobContext.Provider value={{
        ...this.state,
        getPrintJobs: this.getPrintJobs,
        updatePrintJob: this.updatePrintJob,
        filterPrintJobs: this.filterPrintJobs,
        getPage: this.getPage,
        sendEmailWithPDF: this.sendEmailWithPDF,
        updateShouldFlattenAndSend: this.updateShouldFlattenAndSend,
        checkForAutomatedComments: this.checkForAutomatedComments,
        openOrCloseModal: this.openOrCloseModal,
        getDiecutAndUpdateComments: this.getDiecutAndUpdateComments,
        downloadFile: this.downloadFile,
      }}>
        {this.props.children}
      </PrintJobContext.Provider>
    );
  }
}



export default PrintJobInfoProvider;