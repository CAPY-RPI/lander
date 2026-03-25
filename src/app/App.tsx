/**
 * The root component for the application logic (/app/*).
 * This section acts as the primary tool container isolated from the Lander.
 */
import { Helmet } from 'react-helmet-async'

export default function AppMain() {
  return (
    <div className="appRoot" style={{ padding: '2rem', textAlign: 'center' }}>
      <Helmet>
        <title>CAPY App</title>
      </Helmet>
      <h1>CAPY App</h1>
      <p>Welcome to the main application area.</p>
    </div>
  )
}
