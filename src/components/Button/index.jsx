import "./styles.scss"

export function Button({ isOutlined = false, width = false, ...props }) {
    return (
        <button 
            className={`button ${isOutlined ? "outlined" : ""} ${width ? "width" : ""}`}
            {...props} 
        />    
    )
}