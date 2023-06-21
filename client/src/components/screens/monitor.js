import React from "react";

//<i className="material-icons left" style={{color: 'black', marginLeft: '3px'}}>check_box</i>
//<i className="material-icons left" style={{color: 'black', marginLeft: '3px'}}>warning</i>

const Monitor = () => {
    return(
        <div className="records">
            <div className="col s12 m7">
                <div className="card horizontal">
                    <div className="card-stacked">
                        <div className="card-content">
                            <i className="material-icons left" style={{color: 'black', marginLeft: '3px'}}>fingerprint</i>
                            <p>I am a very simple card.</p>
                        </div>
                        <div class="card-action">
                            <a href="https://console.firebase.google.com/u/0/project/esp32cam-photos/storage/esp32cam-photos.appspot.com/files">Go to database</a>
                        </div>
                        <div className="card-content">
                            <i className="material-icons left" style={{color: 'black', marginLeft: '3px'}}>fingerprint</i>
                            <p>I am a very simple card.</p>
                        </div>
                        <div class="card-action">
                            <a href="https://console.firebase.google.com/u/0/project/esp32cam-photos/storage/esp32cam-photos.appspot.com/files">Go to database</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Monitor