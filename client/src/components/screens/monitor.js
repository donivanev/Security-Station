import React, { useEffect, useState } from "react";

//<i className="material-icons left" style={{color: 'black', marginLeft: '3px'}}>check_box</i>
//<i className="material-icons left" style={{color: 'black', marginLeft: '3px'}}>warning</i>

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
                                    <div className="card-stacked">
                                        <div className="card-content">
                                            <i className="material-icons left" style={{color: 'black', marginLeft: '3px'}}>fingerprint</i>
                                            <i className="material-icons left" style={{color: 'black', marginLeft: '3px'}}>check_box</i>
                                            <p>{record[0]} {record[1]}</p>
                                        </div>
                                        <div className="card-action">
                                            <a href="https://console.firebase.google.com/u/0/project/esp32cam-photos/storage/esp32cam-photos.appspot.com/files">Go to database</a>
                                        </div>
                                    </div>
                                </div>)
                    })
                }
            </div>
        </div>
    )
}

export default Monitor