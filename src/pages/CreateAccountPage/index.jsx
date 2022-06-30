import { Image } from "@chakra-ui/react"

import { Button } from "../../components/Button/index"

import illustrationImg from "../../assets/illustration.svg"
import logInImg from "../../assets/log-in.svg"
import backArrowImg from "../../assets/arrow.svg"

import "../LoginPage/styles.scss"

export function CreateAccountPage() {
    return (
        <div id="pageAuth">
            <a href="/">
                <Image src={ backArrowImg }height='2rem' position='absolute' top='1rem' left='1rem' />
            </a>
            <aside>
                <img src={ illustrationImg } alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Sua gestão pode ser melhor.</strong>
                <p>Gerencia as tarefas e necessidades da sua empresa.</p>
            </aside>

            <main>
                <div className="mainContent">
                    <div className="separator">Cadastre sua conta com email e senha</div>
                    <div className="form">
                        <input
                            type="email"
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                        />
                        <Button>
                            <img src={ logInImg } alt="Log In Icon" />
                            Criar conta
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}