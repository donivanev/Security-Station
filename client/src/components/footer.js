import React from 'react'

const Footer = () => {
    return (
        <footer className="page-footer">
            <div className="container">
                <div className="row">
                    <div className="col l7 s12">
                        <br/>
                        <h5 className="black-text">Enjoyed? If so, then please give a star to the github repo.</h5>
                    </div>
                    <div className="col l1 offset-l2 s12">
                        <ul>
                            <li>
                                <a className="grey-text text-lighten-3" href="https://github.com/donivanev/Security-Station">
                                    <i className="fa fa-github" style={{fontSize: '48px', color: 'black'}}></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-copyright black-text">
                <div className="center">
                    © 2023 Security Station
                </div>
            </div>
        </footer>
    )
}

export default Footer