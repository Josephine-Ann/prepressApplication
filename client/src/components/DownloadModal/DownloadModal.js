import { useContext } from "react";
import { PrintJobContext } from "../../PrintJobInfoProvider";
import sendButtonSelected from "./Utils/sendButtonSelected";
import "./DownloadModal.css";

const DownloadModal = ({ email, jobPDF }) => {
    const { modalOpen, openOrCloseModal, updateShouldFlattenAndSend, downloadFile } = useContext(PrintJobContext);

    return (
        <>
            <div id="modal" style={{
                display: modalOpen ? 'flex' : 'none',
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    background: 'white',
                    display: 'flex',
                    padding: '20px',
                    width: '80vw',
                    height: '80vh',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <button style={{ border: 'none', backgroundColor: 'transparent', display: 'flex', width: '100%', justifyContent: 'flex-end' }}><i style={{ cursor: 'pointer' }} onClick={openOrCloseModal} className="close-menu fa-solid fa-xmark"></i></button>
                    <p>Please Revise Details Before Sending</p>
                    <div className="form-container">
                        <div>
                            <div className="scrollable-window">
                                {email.current && email.current.opening.split('\n').map((em, index) => <p key={index}>{em}</p>)}
                                <h3>To Revise</h3>
                                {
                                    email.current && email.current.errors.map((em, index) => <p key={index}>{em}</p>)
                                }
                                {
                                    email.current && email.current.closing.split('\n').map((em, index) => <p key={index}>{em}</p>)
                                }
                            </div>
                            <div className="form-content">
                                <div><button className="downloadButtons" onClick={() => downloadFile(jobPDF)}><i className="fa-solid fa-file-arrow-down"></i>Download Copy For Safekeeping</button></div>
                                <div><button id="sendBtn" className="downloadButtons" onClick={() => { updateShouldFlattenAndSend(); sendButtonSelected(); }}><i className="fa-solid fa-file-import"></i>Send</button></div>
                                <div><button onClick={openOrCloseModal} className="downloadButtons"><i className="fa-solid fa-xmark"></i>Cancel</button></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default DownloadModal;