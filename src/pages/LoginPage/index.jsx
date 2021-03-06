import { useNavigate } from "react-router-dom"

import { Button } from "../../components/Button/index"

import illustrationImg from "../../assets/illustration.svg"
import googleIconImg from "../../assets/google-icon.svg"
import logInImg from "../../assets/log-in.svg"

import "./styles.scss"

export function LoginPage() {
    const navigate = useNavigate()

    return (
        <div id="pageAuth">
            <aside>
                <img src={ illustrationImg } alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Sua gestão pode ser melhor.</strong>
                <p>Gerencia as tarefas e necessidades da sua empresa.</p>
            </aside>

            <main>
                <div className="mainContent">
                    <button onClick={() => navigate("/home")} className="googleLogin">
                        <img src={ googleIconImg } alt="Logo do Google" />
                        Entre na sua conta com o Google
                    </button>
                    <div className="separator">ou entre com email e senha</div>
                    <div className="form">
                        <input
                            type="email"
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                        />
                        <Button onClick={() => navigate("/home")}>
                            <img src={ logInImg } alt="Log In Icon" />
                            Entrar
                        </Button>
                    </div>
                    <div onClick={() => navigate("/account/create")} className="createAccount">Ainda não tem uma conta? Crie agora!</div>
                </div>
            </main>
        </div>
    )
}