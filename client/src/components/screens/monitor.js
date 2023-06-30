import React, { useEffect, useState } from "react";

const Monitor = () => {
    const [attendance, setAttendance] = useState([])

    useEffect(() => {
        fetch('http://localhost:3000/monitor')
        .then(res => res.json())
        .then(res => {
            setAttendance(res)
        })
    }, [])

    return(
        <div className="records">
            <div className="col s12 m7">
                {
                    attendance.map(record => {
                        return (<div className="card horizontal">
                                {record[0] === "Alert!" ?
                                    (<div className="card-stacked">
                                        <div className="card-content">
                                            <i className="material-icons left" style={{color: 'black', marginLeft: '3px'}}>fingerprint</i>
                                            <i className="material-icons left" style={{color: 'red', marginLeft: '3px'}}>warning</i>
                                            <p>{record[0]} {record[1]}</p>
                                        </div>
                                        <div className="card-action">
                                            <a href="https://console.firebase.google.com/u/0/project/esp32cam-photos/storage/esp32cam-photos.appspot.com/files/~2Fdata" target="_blank" rel="noreferrer" style={{color: "black", textDecoration: "underline"}}>
                                                Go to database
                                                <i className="material-icons left" style={{color: 'black', marginLeft: '3px'}}>arrow_forward</i>
                                            </a>
                                        </div>
                                    </div>) :
                                    (<div className="card-stacked">
                                        <div className="card-content">
                                            <i className="material-icons left" style={{color: 'black', marginLeft: '3px'}}>fingerprint</i>
                                            <i className="material-icons left" style={{color: 'green', marginLeft: '3px'}}>check_box</i>
                                            <p>{record[0]} {record[1]}</p>
                                        </div>
                                        <div className="card-action">
                                            <a href="https://console.firebase.google.com/u/0/project/esp32cam-photos/storage/esp32cam-photos.appspot.com/files/~2Fusers" target="_blank" rel="noreferrer" style={{color: "black", textDecoration: "underline"}}>
                                                Go to database
                                                <i className="material-icons left" style={{color: 'black', marginLeft: '3px'}}>arrow_forward</i>
                                            </a>
                                        </div>
                                    </div>)
                                }
                                </div>
                            )
                        }
                    )
                }
            </div>
        </div>
    )
}

export default Monitor