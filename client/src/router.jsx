import { Link as RouterLink, useLocation as useRouterLocation, useNavigate, useParams } from 'react-router-dom';
export function Link({ href, ...props }) { return <RouterLink to={href} {...props} />; }
export function useLocation() { const location = useRouterLocation(); const navigate = useNavigate(); return [location.pathname + location.search, navigate]; }
export function useRoute() { const params = useParams(); return [true, params]; }
