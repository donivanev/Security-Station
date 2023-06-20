import React from "react";

const About = () => {
    return(
        <div class="center" style={{ marginLeft: 'auto', marginTop: '30px', marginBottom: '50px' }}>
            <div class="col s12 m6">
                <div class="card blue darken-1">
                    <div class="card-content white-text">
                        <span class="card-title" style={{fontSize: '50px', marginBottom: '50px'}}>Hey there!</span>
                        <p style={{fontSize: '20px'}}>My name is Doni Ivanov. I am currently studying Computer Science at Sofia University.
                           This is my project for the Robotics course. 
                           I hope you like it! You can follow me on the media below :)
                        </p>
                    </div>
                    <div class="card-action">
                        <a href="https://www.facebook.com/ko.ok.1000/">
                            <i className="fa fa-facebook-square" style={{fontSize: '40px', color: 'white'}}></i>
                        </a>
                        <a href="https://www.linkedin.com/in/doni-ivanov-7b65331a6/">
                            <i className="fa fa-linkedin-square" style={{fontSize: '40px', color: 'white'}}></i>
                        </a>
                        <a href="https://github.com/donivanev">
                            <i className="fa fa-github" style={{fontSize: '40px', color: 'white'}}></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About