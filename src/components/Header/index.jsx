import backArrowImg from "../../assets/arrow.svg"

import "./styles.scss"

export function Header() {
    return (
        <header id="header">
            <div>
                <div>
                    <a className="backButton" href="/login">
                        <img src={ backArrowImg } alt="" />
                    </a>
                    <a className="profile" href="/login">
                        <div>
                            <h2>Lucas Rocha</h2>
                            <h6>Ver Perfil</h6>
                        </div>
                        <img src="https://avatars.githubusercontent.com/lucasgvr" alt="" />
                    </a>
                </div>
            </div>
        </header>
    )
}