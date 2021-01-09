import React from 'react'
import monzoLogo from '../assets/monzoLogo.png';

export const Header = () => {
    return(
        <div className="header fade-in">
            {/* <img src={monzoLogo} alt="logo" style={{
                display: 'inline-block',
                height: '50px',
                filter: 'contrast(0%) brightness(20%)'
            }}></img> */}
            <h1 style={{
                display: 'inline-block',
                marginLeft: '10px',
                verticalAlign: 'top',
                opacity: '0.8',
                fontWeight: '500'
            }}>LifeBoard</h1>
        </div>
    )
}