import Logo from '../assets/logo.png'

const LogoComponent = ({width = 120, alt = "App Logo", className=""}) => {
    return (
        <img 
            src={Logo} 
            alt={alt} 
            width={width} 
            className={className}
        />
    )
};

export default LogoComponent;