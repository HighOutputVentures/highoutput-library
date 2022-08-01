import * as React from 'react';
import AuthContext, { AuthConfig } from './AuthContext';

/**
 *
 * @example
 * // _app.tsx
 * <AuthProvider hostname={process.env.NEXT_PUBLIC_API_URL}>
 *    <App />
 * <AuthProvider/>
 *
 *
 * @example
 * // _login.tsx
 * const {generateOtp} = useAuth()
 * const [email, setEmail] = useState("")
 *
 * const handleChange = (e) => {
 *    setEmail(e.target.value)
 * }
 *
 * const handleSubmit = async (e) => {
 *    e.preventDefault()
 *
 *    try {
 *      generateOtp(email)
 *
 *      ...
 *    } catch (e) {
 *      ...
 *    }
 * }
 *
 * return (
 *    <form onSubmit={handleSubmit}>
 *        <input
 *          type="email"
 *          name="email"
 *          placeholder="Email"
 *          onChange={handleChange}
 *        />
 *
 *        <button type="submit">Login</button>
 *    </form>
 * );
 *
 */
const AuthProvider: React.FC<React.PropsWithChildren<AuthConfig>> = props => {
  const { children, ...config } = props;

  return <AuthContext.Provider value={config}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
