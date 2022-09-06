import Tab from '@mui/material/Tab';
import { useNavigate } from 'react-router-dom';

export default function TabLink(props) {
    const { href } = props;
    const navigate = useNavigate();
    return (
        <Tab
            element="a"
            onClick={(event) => {
                event.preventDefault();
                navigate(href);
            }}
            {...props}
        />
    );
}