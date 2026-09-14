import "./Login.css"
import Login from './Login'

const Auth = () => {
  return (
    <div>
        <div class="background-tape left"></div>
        <div class="center">
            <div>
                <div class="center-background">
                    <h1>Fazer login</h1>
                    <h2>
                    Esta é apenas uma conta teste,<br />
                    e sera apagada do banco de dados apos 30 dias.
                    </h2>
                </div>
                <Login />
            </div>
        </div>
    </div>
  )
}

export default Auth