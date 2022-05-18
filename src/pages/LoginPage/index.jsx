import { useState } from "react" 
import { useNavigate } from "react-router-dom"

import illustrationImg from "../../assets/illustration.svg"
import googleIconImg from "../../assets/google-icon.svg"
import logInImg from "../../assets/log-in.svg"

import { Button } from "../../components/Button/index"

import "./styles.scss"

export function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleGoogleLogin() {
        navigate("/")
    }

    async function handleLogin(event) {
        navigate("/")
    }

    return (
        <div id="pageAuth">
            <aside>
                <img src={ illustrationImg } alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Sua gestão pode ser melhor.</strong>
                <p>Gerencia as tarefas e necessidades da sua empresa.</p>
            </aside>

        <main>
            <div className="mainContent">
                <button onClick={ handleGoogleLogin } className="createRoom">
                    <img src={ googleIconImg } alt="Logo do Google" />
                    Entre na sua conta com o Google
                </button>
                <div className="separator">ou entre com email e senha</div>
                <form onSubmit={ handleLogin }>
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={ event => setEmail(event.target.value) }
                        value={ email }
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        onChange={ event => setPassword(event.target.value) }
                        value={ password }
                    />
                    <Button type="submit">
                        <img src={ logInImg } alt="Log In Icon" />
                        Entrar
                    </Button>
                </form>
            </div>
        </main>
    </div>
    )
}