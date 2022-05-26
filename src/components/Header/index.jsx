import backArrowImg from "../../assets/arrow.svg"

import "./styles.scss"

export function Header() {
    return (
        <header id="header">
            <div className="container">
                <div>
                    <a className="backButton" href="/">
                        <img src={ backArrowImg } alt="" />
                    </a>
                    <a className="profile" href="/profile">
                        <div>
                            <h2>Lucas Rocha</h2>
                            <h6>Ver Perfil</h6>
                        </div>
                        <img src="https://avatars.githubusercontent.com/lucasgvr" alt="User Avatar" />
                    </a>
                </div>
            </div>
        </header>
    )
}